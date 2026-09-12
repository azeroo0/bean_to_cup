import test from 'node:test';
import assert from 'node:assert/strict';
import { blendAtmosphere, chapters } from '../src/chapters.js';
import { deviceScale, particleBudget, roastingTemperature, seedRandom } from '../src/math.js';
test('interpolation preserves every endpoint and blends physical velocity through zero',()=>{
  for(let i=1;i<chapters.length;i++){
    const from=chapters[i-1].palette,to=chapters[i].palette;
    assert.deepEqual(blendAtmosphere(from,to,0),from);
    assert.deepEqual(blendAtmosphere(from,to,1),to);
    const mid=blendAtmosphere(from,to,.5);
    assert.equal(mid.vy,(from.vy+to.vy)/2);assert.equal(mid.count,(from.count+to.count)/2);
    assert.equal(mid.rx,(from.rx+to.rx)/2);assert.equal(mid.top[1],(from.top[1]+to.top[1])/2);
  }
});
test('chapter physics are different, brewing contains opposing flows, final density is two',()=>{
  assert.ok(chapters[0].palette.vy>0);assert.ok(chapters[1].palette.vy<0);
  assert.ok(chapters[2].palette.vy>300);assert.ok(chapters[2].palette.secondaryVy<0);
  assert.equal(chapters[3].palette.count,2);assert.equal(chapters[3].palette.plume,1);
});
test('temperature tracks both directions and clamps overscroll',()=>{
  assert.equal(roastingTemperature(0),20);assert.equal(roastingTemperature(.5),110);assert.equal(roastingTemperature(1),200);
  assert.equal(roastingTemperature(-1),20);assert.equal(roastingTemperature(2),200);
});
test('mobile scales pools to sixty percent while preserving two final plumes and capping DPR',()=>{
  assert.equal(particleBudget(150,true),90);assert.equal(particleBudget(150,false),150);assert.equal(particleBudget(2,true),2);
  assert.equal(deviceScale(3),2);assert.equal(deviceScale(1.5),1.5);
});
test('static particle seeds are repeatable',()=>{
  const a=seedRandom(42),b=seedRandom(42);for(let i=0;i<100;i++)assert.equal(a(),b());
});

import { samplePose } from '../src/cinematic.js';
test('cinematic scenes join without position or visibility discontinuities',()=>{
 for(let index=0;index<4;index++)assert.deepEqual(samplePose(index,1),samplePose(index+1,0));
});
test('reverse scrolling restores every cinematic parameter and the finale settles on a cup',()=>{
 const expected=samplePose(2,.42);samplePose(2,.96);samplePose(3,.2);assert.deepEqual(samplePose(2,.42),expected);
 const final=samplePose(4,1);assert.equal(final.cup,1);assert.equal(final.bean,0);assert.equal(final.cherry,0);assert.equal(final.drop,0);
 for(let scene=0;scene<5;scene++)for(let p=0;p<=1;p+=.025)for(const n of Object.values(samplePose(scene,p)))assert.ok(Number.isFinite(n));
});
test('the brewing portal opens monotonically and stays open during the cup reveal',()=>{
 let previous=0;
 for(let i=0;i<=100;i++){
  const pose=samplePose(3,i/100);assert.ok(pose.portal>=previous);assert.ok(pose.portal<=1);previous=pose.portal;
 }
 assert.equal(previous,1);assert.equal(samplePose(4,.12).portal,1);
 assert.ok(samplePose(4,.12).scale>samplePose(4,1).scale);
 assert.equal(samplePose(2,0).swarm,0);assert.equal(samplePose(2,1).swarm,0);
 assert.equal(samplePose(2,.4).swarm,1);
});
