import 'babel-polyfill';

const Base = {};

/**
 * 获取指定的 querystring 中指定 name 的 value
 * @param {String} name
 * @param {String} querystring
 * @return {String|undefined}
 *
 * query('hello', '?hello=js') 结果是 js
 *
 */
Base.query = (queryString, name) => {
  const reg = new RegExp('(?:\\?|&)' + name + '=(.*?(?=&|$))');
  const result = reg.exec(queryString) || [];

  return result[1];
}

/**
 * 序列化对象，就是把对象转成 url 字符串
 * @param {Obj} data
 * @return {String}
 *
 * serialize({hello: 'js', hi: 'test'}) 结果是 ''
 */
Base.serialize = (obj) => {
  let str = '';

  if (Object.prototype.toString.call(obj) !== '[object Object]') {
    return null;
  }
  const data = Object.entries(obj);

  for (let [key, value] of data) {
    str += `${key}=${value}&`
  }

  return str.slice(0,str.length-1);
}

/**
 * 根据选择器查找 DOM
 * 就是模拟 $() ，当然，这里返回元素的 DOM 对象即可 (这里不能获取多级选择器的元素，只能获取单个选择器的元素 - 标签、类名、id)
 * @param {String} selector
 * @return {DOM|Null}
 */
Base.$ = (selector) => {
  if (!selector || typeof selector !== 'string') {
    return null;
  }
  const doc = document;
  const reg = /^(?:\s*[\.\#]([\w-]+))$/;
  const result = reg.exec(selector);

  // #div / .div
  if (result && result[1]) {
    if (result[0].includes('.')) { // .div
      const cArray = doc.getElementsByClassName(result[1]);
      const c_len = cArray.length;
      return c_len ? cArray : null;
    } else { // #div
      return doc.getElementById(result[1]);
    }
  } else { // div
    const tArray = doc.getElementsByTagName(selector);
    const t_len = tArray.length;
    return t_len ? tArray : null;
  }
}

/**
 * 删除 DOM 节点
 * @param {DOM} node
 * @return {DOM}
 */
Base.removeNode = (node) => {
  if (node && node.nodeType === 1) {
    const pNode = node.parentNode;
    const result = pNode.removeChild(node);
    return result;
  }

  return false;
}

/**
 * 在 target 节点之后插入 node 节点
 * 类似 $().insertAfter()
 * @param {DOM} node
 * @param {DOM} target
 */
Base.insertAfter = (node, target) => {
  if (node && node.nodeType === 1 && target && target.nodeType === 1) {
    const pNode = target.parentNode;
    const targetNextNode = target.nextElementSibling;

    if (targetNextNode) {
      pNode.insertBefore(node, targetNextNode);
      return true;
    } else {
      pNode.appendChild(node);
      return true;
    }
  }

  return false;
}

/**
 * 判断元素中是否有此类名
 * @param node
 * @param className
 */
Base.hasClass = (node, className) => {
  if (node && node.nodeType === 1 && typeof className === 'string') {
    const cNames = node.className;
    const reg = new RegExp(`\\b${className}\\b`);

    return reg.test(cNames);
  }

  return null;
}

/**
 * 添加类名
 * @param {DOM} node
 * @param {String|Array} className
 */
Base.addClass = (node, className) => {
  if (node && node.nodeType === 1 && className) {
    const isType = Base.isType;
    const hasClass = Base.hasClass;

    // 法1
    // const cNames = node.classList,
    //       proceed = typeof className === 'string' && className;
    //
    // if (proceed && !cNames.contains(className)) {
    //   cNames.add(className);
    //   return true;
    // }

    // 法2

    switch (isType(className)) {
      case `[object String]`: // string
        if (!hasClass(node, className)) {
          node.className += ` ${className.trim()}`;
        }
        break;
      case `[object Array]`: // array
        for (let cName of className) {
          if (isType(cName) === `[object String]` && cName.trim() !== '' && !hasClass(node, cName)) {
            node.className += ` ${cName.trim()}`;
          }
        }
        break;
      default:
        return false;
    }
  }

  return null;
}


/**
 * 移除类名
 * @param {DOM} node
 * @param {String|Array} className
 */
Base.removeClass = (node, className) => {
  if (node && node.nodeType === 1 && className) {
    const isType = Base.isType;
    const hasClass = Base.hasClass;

    // className => String
    switch (isType(className)) {
      case `[object String]`: //string
        if (hasClass(node, className)) {
          node.className = node.className.replace(new RegExp(`\\b${className}\\b`), '');
        }
        break;
      case `[object Array]`: //array
        for (let cName of className) {
          if (isType(cName) === `[object String]` && hasClass(node, cName)) {
            node.className = node.className.replace(new RegExp(`\\b${cName}\\b`), '');
          }
        }
        break;
      default:
        return false;
    }
  }

  return null;
}

/**
 * 获取绝对路径
 * @param {String} url
 * @return {String}
 *
 * getAbsoluteUrl('/jerojiang') => 'http://imweb.io/jerojiang'
 * 在当前页面获取绝对路径，这里要创建 A 元素，测试用例看你们的了
 */
Base.getAbsoluteUrl = (url) => {
  if (!url) {
    return null;
  }

  if (typeof url !== `string` || url.indexOf(`/`) !== 0 ) {
    return null;
  }

  // 法1：不过在测试案例中无法测试
  // const href = location.href;
  // const match = href.match(/^https?:\/\/.*?\//)[0];
  // return `${match.substring(0, match.length-1)}${url}`;

  // 法2：通过a标签获取当前目录的绝对路径
  const aTag = document.createElement('a');
  aTag.href = url;
  return aTag.href;
}

/**
 * 防抖动
 * 防抖动函数了啦，有做个这个习题，不清楚回去复习
 */
Base.debounce = (callback, time, context) => {
  let timerId = null;

  return () => {
    clearTimeout(timerId);
    const fn = callback.bind(context);
    setTimeout(fn, time);
  }
}

/**
 *  根据索引移出数组的某一项
 * @param {Number} index
 * @param {Array} arr
 * @return {Array}
 *
 * removeItemByIndex(1, [1,2,3]) => [1, 3]
 */
Base.removeItemByIndex = (index, arr) => {
  const isType = Base.isType;

  if (isType(index) !== `[object Number]` || isType(arr) !== `[object Array]`) {
    return;
  }

  if (!arr[index]) {
    return false;
  }

  arr.splice(index, 1);

  return arr;
}

/**
 * 判断数据的类型
 * @param data  - Object/Array/String
 * @returns {boolean}
 */
Base.isType = (data) => {
  return Object.prototype.toString.call(data);
}

module.exports = Base;

