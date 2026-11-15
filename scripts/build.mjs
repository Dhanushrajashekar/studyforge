import {mkdir,cp,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url)),out=path.join(root,'dist');
await mkdir(out,{recursive:true});
for(const n of ['index.html','404.html'])await writeFile(path.join(out,n),await readFile(path.join(root,n)));
for(const n of ['styles.css','challenges.js','runner.js','app.js'])await cp(path.join(root,'src',n),path.join(out,n));
await writeFile(path.join(out,'.nojekyll'),'');
console.log('Built dist/');
