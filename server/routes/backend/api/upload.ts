import fs from 'fs';
export default defineEventHandler(async (event) => {
  console.log('defineEventHandler backend');
  fs.unlink('./public/dummy-sample.pdf', (err) => {
    console.log(err);
  });
  const stream = fs.createWriteStream('./public/dummy-sample.pdf');
  //event.node.res.end();
  event.node.req.pipe(stream);
});
