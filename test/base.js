// const base = require('../js/base');

import base from "../js/base";

/**
 * test query
 */
describe(`test query` , () => {
  const query = base.query;

  test(`test: name = jm`, () => {
    expect(query(`?name=jm`, `name`)).toBe(`jm`);
  })

  test(`test: name = "empty string"`, () => {
    expect(query('?name=', `name`)).toBe("");
  })

  test(`test: name is not exist with no param`, () => {
    expect(query(`?`, `name`)).toBe(undefined);
  })

  test(`test: name has more params`, () => {
    expect(query(`?name=jm&name1=aa`, `name`)).toBe(`jm`);
  })
})

/**
 * test serialize
 */
describe(`test serialize`, () => {
  const serialize = base.serialize;

  test(`test: serialize successfully`, () => {
    expect(serialize({
      one: 1,
      two: 2,
      three: ''
    })).toBe(`one=1&two=2&three=`);
  })

  test(`test: param "obj" is an empty object`, () => {
    expect(serialize({})).toBe("");
  })

  test(`test: param "obj" is not an object`, () => {
    expect(serialize([])).toBe(null);
    expect(serialize('{one: 1}')).toBe(null);
    expect(serialize(2)).toBe(null);
  })
})

/**
 * test $
 */
describe(`test $`, () => {
  const $ = base.$;
  test(`param => selector doesn't exist or isn't a string`, () => {
    expect($()).toBe(null);
    expect($(1111)).toBe(null);
    expect($({})).toBe(null);
    expect($([])).toBe(null);
    expect($(true)).toBe(null);
  })

  describe(`param => selector is only an id selector`, () => {
    document.body.innerHTML = '<div id="div">你好</div>';
    test(`the element exists`, () => {
      expect($('#div').id).toBe('div');
    })
    test(`the element doesn't exist`, () => {
      expect($('#ul')).toBe(null);
    })
  })

  describe(`param => selector is only a class selector`, () => {
    test(`the element exists`, () => {
      document.body.innerHTML = '<div class="hello">你好</div>';

      const hello = $('.hello')[0];
      expect(hello.nodeName.toLowerCase()).toBe('div');
    })
    test(`the elements doesn't exist`, () => {
      expect($('.ul')).toBe(null);
    })
  })

  describe(`param => selector is only an tag selector`, () => {
    document.body.innerHTML = '<div id="parent"><p></p><p class="p1">hello</p></div>';
    test(`an tag selector`, () => {
      const len = $('div').length
      expect(len).toBe(1);
    })

    test(`the elements doesn't exist`, () => {
      expect($('ul')).toBe(null);
    })
  })
})


/**
 * test insertAfter
 */
describe(`test insertAfter`, () => {
  const insertAfter = base.insertAfter;
  describe(`test: params`, () => {
    test(`params don't exist`, () => {
      expect(insertAfter(null, null)).toBe(false);
    })

    test(`params aren't nodes`, () => {
      expect(insertAfter(``, ``)).toBe(false);
    })
  })

  describe(`test: the target node is the last node`, () => {
    test(`success`, () => {
      document.body.innerHTML = `<div id="parent"><i id="i1">1</i><i id="i2">2</i></div>`;
      const pNode = document.getElementById('parent');
      const newNode = document.createElement('span');
      const target = document.getElementById('i2');
      expect(insertAfter(newNode, target)).toBe(true);
      expect(pNode.children[pNode.children.length - 1].nodeName.toLowerCase()).toBe('span');
    })
  })

  describe(`test: the target node isn't the last node`, () => {
    test(`success`, () => {
      document.body.innerHTML = `<div id="parent"><i id="i1">1</i><i id="i2">2</i></div>`;
      const pNode = document.getElementById('parent');
      const newNode = document.createElement('span');
      const target = document.getElementById('i1');
      expect(insertAfter(newNode, target)).toBe(true);
      expect(pNode.children[pNode.children.length - 2].nodeName.toLowerCase()).toBe('span');
    })
  })
})

/**
 * test removeNode
 */
describe (`test removeNode`, () => {
  const removeNode = base.removeNode;

  test(`node is an element`, ()=> {
    document.body.innerHTML = `<ul id="list"><li>hello</li><li></li><li></li><li></li><li></li></ul>`;
    const list = document.getElementById('list');
    const aLi = list.getElementsByTagName('li');
    const firstLi = list.querySelector('li');

    expect(aLi.length).toBe(5);
    const result = removeNode(firstLi);
    expect(result).toBe(firstLi);
    expect(aLi.length).toBe(4);
  })

  test(`node is not an element`, ()=> {
    document.body.innerHTML = `<ul id="list"><li>hello</li><li></li><li></li><li></li><li></li></ul>`;
    const list = document.getElementById('list');
    const aLi = list.getElementsByTagName('li');

    expect(aLi.length).toBe(5);
    const result = removeNode('firstList');
    expect(result).toBe(false);
    expect(aLi.length).toBe(5);
  })
})


/**
 * test hasClass
 */
describe(`test hasClass`, () => {
  document.body.innerHTML = '<div id="div" class="red test1"></div>';

  const hasClass = base.hasClass;
  const div = document.getElementById('div');

  describe('test params', () => {
    test(`test: the param "className" isn't a string or doesn't exist`, () => {
      expect(hasClass(div, 1)).toBe(null);
      expect(hasClass(div)).toBe(null);
    })

    test(`test: the param "node" isn't an element`, () => {
      expect(hasClass(document.createTextNode('a'), 'a')).toBe(null);
    })
  })

  describe(`test detail`, () => {
    test(`test: the className "test" has the same part in the cNames`, () => {
      expect(hasClass(div, 'test')).toBe(false);
    })

    test(`test: the className "blue" is non-exist`, () => {
      expect(hasClass(div, 'blue')).toBe(false);
    })

    test(`test: the className "red" exists`, () => {
      expect(hasClass(div, 'red')).toBe(true);
    })
  })
})

/**
 * test addClass
 */
describe(`test addClass`, () => {
  const addClass = base.addClass;

  describe(`test params`, () => {
    test(`test: the param "node" isn't an element`, () => {
      expect(addClass(document.createTextNode('a'), 'a')).toBe(null);
    })

    test(`test: the param "className" doesn't exist`, () => {
      document.body.innerHTML = '<div id="div" class="red test1"></div>';
      const div = document.getElementById('div');
      expect(addClass(div)).toBe(null);
    })
  })

  // string
  describe('test: className is string', () => {
    document.body.innerHTML = '<div id="div" class="red test1"></div>';
    const div = document.getElementById('div');

    test(`test: add an existed className`, () => {
      addClass(div, 'red');
      const len = div.className.match(/\bred\b/g).length;
      expect(len).toBe(1);
    })

    test(`test: add a non-exist className`, () => {
      addClass(div, 'linear');
      expect(div.className.includes('linear')).toBe(true);
    })

    test(`test: add a className with the same part string in the className`, () => {
      addClass(div, 'test');
      expect(div.classList.contains('test')).toBe(true);
    })

  })

  // array
  describe(`test: className is array`, () => {
    document.body.innerHTML = '<div id="div" class="red test1"></div>';
    const div = document.getElementById('div');

    test(`test: each item in array doesn't exist in className`, () => {
      addClass(div, ["big", "strong"]);
      expect(div.className).toBe("red test1 big strong");
    })

    test(`test: some item exists in className`, () => {
      addClass(div, ["big", "music"]);
      const len = div.className.match(/\bbig\b/g).length;
      expect(len).toBe(1);
      expect(div.className.includes("music")).toBe(true);
    })

    test(`test: some item has the same part in className`, () => {
      addClass(div, ["big1"]);
      expect(div.className.includes("big1")).toBe(true);
    })
  })

  describe(`test: className isn't a string or an array`, () => {
    document.body.innerHTML = '<div id="div" class="red test1 strong love test lovely"></div>';
    const div = document.getElementById('div');

    test(`add className unsuccessfully`, () => {
      expect(addClass(div, 1)).toBe(false);
      expect(addClass(div, function () {})).toBe(false);
    })
  })

})

/**
 * test removeClass
 */
describe(`test removeClass`, () => {
  const removeClass = base.removeClass;

  describe('test params', () => {
    test(`test: the param "className" doesn't exist`, () => {
      expect(removeClass(div)).toBe(null);
    })

    test(`test: the param "node" isn't an element`, () => {
      expect(removeClass(document.createTextNode('a'), 'a')).toBe(null);
    })
  })

  describe(`test: remove a string`, () => {
    document.body.innerHTML = '<div id="div" class="red test1 strong love test"></div>';
    const div = document.getElementById('div');

    test(`remove a className successfully`, () => {
      removeClass(div, 'strong');
      expect(div.classList.contains(`strong`)).toBe(false);
    })

    test(`remove a className with the same part in the className successfully`, () => {
      removeClass(div, 'test');
      expect(div.classList.contains(`test`)).toBe(false);
      expect(div.classList.contains(`test1`)).toBe(true);
    })
  })

  describe(`test: remove an array`, () => {
    document.body.innerHTML = '<div id="div" class="red test1 strong love test lovely"></div>';
    const div = document.getElementById('div');

    test(`remove an array successfully`, () => {
      removeClass(div, ["love", "red"]);
      expect(div.classList.contains(`love`)).toBe(false);
      expect(div.classList.contains(`red`)).toBe(false);
    })

    test(`remove some item with the same part in the className`, () => {
      removeClass(div, ["test", "red"]);
      expect(div.classList.contains(`test`)).toBe(false);
      expect(div.classList.contains(`test1`)).toBe(true);
    })
  })

  describe(`test: className isn't a string or an array`, () => {
    document.body.innerHTML = '<div id="div" class="red test1 strong love test lovely"></div>';
    const div = document.getElementById('div');

    test(`remove className unsuccessfully`, () => {
      expect(removeClass(div, 1)).toBe(false);
      expect(removeClass(div, function () {})).toBe(false);
    })
  })
})

/**
 * test getAbsoluteUrl
 */
describe(`test getAbsoluteUrl`, () => {
  const getAbsolute = base.getAbsoluteUrl;

  test(`param => url  doesn't exist`, () => {
    expect(getAbsolute()).toBe(null);
  })

  test(`param => url  doesn't a string`, () => {
    expect(getAbsolute([])).toBe(null);
  })

  test(`param => url whose first string isn't "/"`, () => {
    expect(getAbsolute()).toBe(null);
  })

  test(`get an absolute url successfully`, () => {
    expect(getAbsolute('/hello').includes('/hello')).toBe(true);
  })
})

/**
 * test isType
 */
describe(`test isType`, () => {
  const isType = base.isType;

  test(`test type`, () => {
    expect(isType([])).toBe('[object Array]');
    expect(isType({})).toBe('[object Object]');
    expect(isType('')).toBe('[object String]');
  })
})

/**
 * test debounce
 */
describe(`test debounce`, () => {
  const debounce = base.debounce;

  test(`debounce`, () => {
    let num = 0;

    const count = debounce((info) => {
      num++;
      expect(num).toBe(1);
      expect(info).toBe(`name`);
    }, 1000, null);

    for (let i = 0; i < 10; i++) {
      count(`name`);
    }

    expect(num).toBe(0);
  })
})

/**
 * test removeItemByIndex
 */

describe(`test removeItemByIndex`, () => {
  const removeItemByIndex = base.removeItemByIndex;

  describe(`test: params`, () => {
    test(`test: params -> index`, () => {
      expect(removeItemByIndex('aa', [])).toBe(undefined);
    })

    test(`test: params -> arr`, () => {
      expect(removeItemByIndex(1, {})).toBe(undefined);
    })
  })

  describe(`test: other part in the func`, () => {
    test(`item doesn't exist`, () => {
      expect(removeItemByIndex(1, ['1111'])).toBe(false);
    })

    test(`remove item successfully`, () => {
      expect(removeItemByIndex(1, ['a', 'b']).length).toBe(1);
      expect(removeItemByIndex(1, ['a', 'b']).includes('b')).toBe(false);
      expect(removeItemByIndex(1, ['a', 'b']).includes(`a`)).toBe(true);
    })
  })
})

