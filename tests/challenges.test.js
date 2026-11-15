import test from 'node:test';
import assert from 'node:assert/strict';
import {challenges,getFunctionName,pointsEarned} from '../src/challenges.js';
import {readFile} from 'node:fs/promises';
test('30 unique challenges across five learning paths',()=>{
assert.equal(challenges.length,30);
assert.equal(new Set(challenges.map(c=>c.id)).size,30);
assert.deepEqual([...new Set(challenges.map(c=>c.topic))].sort(),['Arrays','Logic','Math','Objects','Strings']);
});
test('challenge schema and cases',()=>{
for(const c of challenges){
for(const f of ['id','title','level','topic','description','example','starter','hint'])assert.ok(typeof c[f]==='string'&&c[f].length,c.id+': '+f);
assert.ok(['Beginner','Intermediate','Advanced'].includes(c.level));
assert.ok(c.points>0);
assert.ok(getFunctionName(c.starter));
assert.ok(c.tests.length>=3,c.id);
for(const t of c.tests){assert.ok(Array.isArray(t.args));assert.ok(Object.hasOwn(t,'expected'));}
}});
test('scoring',()=>{assert.equal(pointsEarned([]),0);assert.equal(pointsEarned([challenges[0].id]),challenges[0].points)});
test('relative paths',async()=>{const h=await readFile(new URL('../index.html',import.meta.url),'utf8');assert.match(h,/\.\/app\.js/);assert.match(h,/\.\/styles\.css/);});
