// boxArr

let width = 800;
let height = 600;

export const boxFunc = () => {
  let boxArr = [];

  boxArr.push({
    x: 0,
    y: 0,
    width: 20,
    height: height
  });
  // boxArr.push({
  //   x: 15,
  //   y: 15,
  //   width: 15,
  //   height: 15
  // });
  boxArr.push({
    x: 0,
    y: height - 20,
    width: width,
    height: 20
  });
  boxArr.push({
    x: 0,
    y: 0,
    width: width,
    height: 20
  });
  boxArr.push({
    x: width - 20,
    y: 0,
    width: 20,
    height: height
  });


  boxArr.push({
    x: 120,
    y: 30,
    width: 80,
    height: 60
  });
  boxArr.push({
    x: 170,
    y: 50,
    width: 80,
    height: 80
  });
  boxArr.push({
    x: 220,
    y: 100,
    width: 80,
    height: 70
  });

  boxArr.push({
    x: 10,
    y: 400,
    width: 200,
    height: 30
  });
  boxArr.push({
    x: 40,
    y: 470,
    width: 300,
    height: 30
  });
  boxArr.push({
    x: 330,
    y: 430,
    width: 50,
    height: 80
  });
  boxArr.push({
    x: 10,
    y: 530,
    width: 250,
    height: 30
  });
  boxArr.push({
    x: 320,
    y: 400,
    width: 200,
    height: 30
  });

  boxArr.push({
    x: 520,
    y: 300,
    width: 100,
    height: 40
  });
  boxArr.push({
    x: 320,
    y: 200,
    width: 100,
    height: 40
  });
  boxArr.push({
    x: 620,
    y: 400,
    width: 200,
    height: 200
  });
  boxArr.push({
    x: 520,
    y: 500,
    width: 80,
    height: 80
  });


  return boxArr;
};
