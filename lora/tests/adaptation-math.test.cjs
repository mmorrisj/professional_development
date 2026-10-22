'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const m = require('../adaptation-math.js');
const near = (a,b,tol=1e-7) => assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
const train = (data, count=200) => {let state=m.initialize();for(let i=0;i<count;i++)state=m.step(state,data);return state;};
test('all six analytic gradients match finite differences of training loss',()=>{
 const data=m.trainingSet('varied'),s={A:[.2,-.3,.1,.4],B:[.5,-.2]},g=m.gradients(s,data),eps=1e-6;
 for(const key of ['A','B'])for(let i=0;i<s[key].length;i++){
  const plus={A:[...s.A],B:[...s.B]},minus={A:[...s.A],B:[...s.B]};
  plus[key][i]+=eps;minus[key][i]-=eps;
  near(g['grad'+key][i],(m.gradients(plus,data).loss-m.gradients(minus,data).loss)/(2*eps));
 }
});
test('zero B starts at the frozen baseline; first step moves B only',()=>{
 const s=m.initialize(),data=m.trainingSet('varied'),next=m.step(s,data);
 for(const e of [...data,...m.testSet])assert.deepEqual(m.predict(s,e.x).adapted,m.predict(s,e.x).frozen);
 assert.deepEqual(next.A,s.A);assert.ok(next.B.some(v=>v!==0));assert.deepEqual(s,m.initialize());
});
test('varied training recovers the authored rank-one update and held-out predictions',()=>{
 const data=m.trainingSet('varied'),s=train(data),update=m.update(s);
 assert.ok(m.rmse(s,data)<1e-6);assert.ok(m.rmse(s,m.testSet)<1e-6);
 for(let i=0;i<2;i++)for(let j=0;j<4;j++)near(update[i][j],m.truthB[i]*m.truthA[j]);
 assert.ok(m.rmse(s,m.testSet,false)>.3);
 assert.deepEqual(m.W,[[.3,.1,-.1,-.15],[.1,.4,.1,-.1]]);
 assert.ok(Object.isFrozen(m.W[0]));
});
test('missing jargon variation yields low train error but material held-out error',()=>{
 const data=m.trainingSet('narrow'),s=train(data);
 assert.ok(data.every(e=>e.x[3]===0));
 assert.ok(m.rmse(s,data)<1e-5);assert.ok(m.rmse(s,m.testSet)>.2);
 assert.equal(s.A[3],m.initialize().A[3]);
 // No amount of extra fitting supplies information absent from the training set.
 assert.ok(m.rmse(train(data,1000),m.testSet)>.2);
});
test('test inputs are distinct from both training sets and never enter gradient updates',()=>{
 for(const coverage of ['varied','narrow']){
  const data=m.trainingSet(coverage),keys=new Set(data.map(e=>JSON.stringify(e.x)));
  assert.equal(keys.size,data.length);
  assert.ok(m.testSet.every(e=>!keys.has(JSON.stringify(e.x))));
 }
 // Training depends only on the examples passed in, including their labels.
 const data=m.trainingSet('varied'),s=m.initialize(),g=m.gradients(s,data);
 const altered=data.map(e=>({...e,y:e.y.map(v=>v+1)}));
 assert.notDeepEqual(m.gradients(s,altered).gradB,g.gradB);
 near(m.gradients(s,data).loss,m.rmse(s,data)**2);
});
