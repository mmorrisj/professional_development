'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const m = require('../training-math.js');
const near = (a,b,tol=1e-8) => assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
test('analytic gradients match central finite differences away from initialization',()=>{
 const state={A:[.3,-.2],B:.7},eps=1e-6,g=m.evaluate(state);
 for(let i=0;i<2;i++){
  const plus={A:[...state.A],B:state.B},minus={A:[...state.A],B:state.B};
  plus.A[i]+=eps;minus.A[i]-=eps;
  near(g.gradA[i],(m.evaluate(plus).loss-m.evaluate(minus).loss)/(2*eps));
 }
 near(g.gradB,(m.evaluate({...state,B:state.B+eps}).loss-m.evaluate({...state,B:state.B-eps}).loss)/(2*eps));
});
test('LoRA-style initialization moves B first, then permits A to move',()=>{
 const s=m.initialize('standard'),g=m.evaluate(s),s1=m.step(s,.1);
 assert.deepEqual(g.gradA,[0,0].map(()=>-0));near(g.gradB,-.6);
 assert.deepEqual(s1.A,s.A);near(s1.B,.06);
 assert.notEqual(m.evaluate(s1).gradA[0],0);
 near(m.evaluate(s1).loss,.464648);
 assert.deepEqual(s,{A:[.4,.1],B:0});
});
test('zero factors stay stuck; reverse initialization moves A first',()=>{
 let s=m.initialize('zeros');for(let i=0;i<20;i++)s=m.step(s,.1);
 near(m.evaluate(s).loss,.5);near(s.B,0);assert.ok(s.A.every(v=>v===0));
 s=m.initialize('reverse');const g=m.evaluate(s),s1=m.step(s,.1);
 near(g.gradB,0);assert.notEqual(g.gradA[0],0);near(s1.B,.4);near(s1.A[0],.04);
});
test('allowed learning rates remain finite and improve this sample; W stays frozen',()=>{
 for(const mode of ['standard','reverse'])for(const rate of [.01,.05,.1]){
  let s=m.initialize(mode);for(let i=0;i<200;i++)s=m.step(s,rate);
  assert.ok(Number.isFinite(m.evaluate(s).loss));assert.ok(m.evaluate(s).loss<.5);
 }
 assert.deepEqual(m.W,[.5,-.25]);assert.ok(Object.isFrozen(m.W));
});
