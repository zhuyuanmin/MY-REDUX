// ?! 顺序执行

function f1(arg) {
  console.log('f1', arg);
  return arg;
}

function f2(arg) {
  console.log('f2', arg);
  return arg;
}

function f3(arg) {
  console.log('f3', arg);
  return arg;
}

// 1、函数嵌套写法
// f3(f2(f1('omg')))

// 2、聚合写法
function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  // fn 聚合后的函数   fn2 当前函数
  return funcs.reduce((fn, fn2) => {
    return (...args) => fn2(fn(...args))
  })
  
}

const res = compose(f1, f2, f3)('omg')
console.log(res);