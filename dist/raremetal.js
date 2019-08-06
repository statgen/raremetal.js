(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["raremetal"] = factory();
	else
		root["raremetal"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 21);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var numeric = ( false)?(undefined):(exports);
if(typeof global !== "undefined") { global.numeric = numeric; }

numeric.version = "1.2.6";

// 1. Utility functions
numeric.bench = function bench (f,interval) {
    var t1,t2,n,i;
    if(typeof interval === "undefined") { interval = 15; }
    n = 0.5;
    t1 = new Date();
    while(1) {
        n*=2;
        for(i=n;i>3;i-=4) { f(); f(); f(); f(); }
        while(i>0) { f(); i--; }
        t2 = new Date();
        if(t2-t1 > interval) break;
    }
    for(i=n;i>3;i-=4) { f(); f(); f(); f(); }
    while(i>0) { f(); i--; }
    t2 = new Date();
    return 1000*(3*n-1)/(t2-t1);
}

numeric._myIndexOf = (function _myIndexOf(w) {
    var n = this.length,k;
    for(k=0;k<n;++k) if(this[k]===w) return k;
    return -1;
});
numeric.myIndexOf = (Array.prototype.indexOf)?Array.prototype.indexOf:numeric._myIndexOf;

numeric.Function = Function;
numeric.precision = 4;
numeric.largeArray = 50;

numeric.prettyPrint = function prettyPrint(x) {
    function fmtnum(x) {
        if(x === 0) { return '0'; }
        if(isNaN(x)) { return 'NaN'; }
        if(x<0) { return '-'+fmtnum(-x); }
        if(isFinite(x)) {
            var scale = Math.floor(Math.log(x) / Math.log(10));
            var normalized = x / Math.pow(10,scale);
            var basic = normalized.toPrecision(numeric.precision);
            if(parseFloat(basic) === 10) { scale++; normalized = 1; basic = normalized.toPrecision(numeric.precision); }
            return parseFloat(basic).toString()+'e'+scale.toString();
        }
        return 'Infinity';
    }
    var ret = [];
    function foo(x) {
        var k;
        if(typeof x === "undefined") { ret.push(Array(numeric.precision+8).join(' ')); return false; }
        if(typeof x === "string") { ret.push('"'+x+'"'); return false; }
        if(typeof x === "boolean") { ret.push(x.toString()); return false; }
        if(typeof x === "number") {
            var a = fmtnum(x);
            var b = x.toPrecision(numeric.precision);
            var c = parseFloat(x.toString()).toString();
            var d = [a,b,c,parseFloat(b).toString(),parseFloat(c).toString()];
            for(k=1;k<d.length;k++) { if(d[k].length < a.length) a = d[k]; }
            ret.push(Array(numeric.precision+8-a.length).join(' ')+a);
            return false;
        }
        if(x === null) { ret.push("null"); return false; }
        if(typeof x === "function") { 
            ret.push(x.toString());
            var flag = false;
            for(k in x) { if(x.hasOwnProperty(k)) { 
                if(flag) ret.push(',\n');
                else ret.push('\n{');
                flag = true; 
                ret.push(k); 
                ret.push(': \n'); 
                foo(x[k]); 
            } }
            if(flag) ret.push('}\n');
            return true;
        }
        if(x instanceof Array) {
            if(x.length > numeric.largeArray) { ret.push('...Large Array...'); return true; }
            var flag = false;
            ret.push('[');
            for(k=0;k<x.length;k++) { if(k>0) { ret.push(','); if(flag) ret.push('\n '); } flag = foo(x[k]); }
            ret.push(']');
            return true;
        }
        ret.push('{');
        var flag = false;
        for(k in x) { if(x.hasOwnProperty(k)) { if(flag) ret.push(',\n'); flag = true; ret.push(k); ret.push(': \n'); foo(x[k]); } }
        ret.push('}');
        return true;
    }
    foo(x);
    return ret.join('');
}

numeric.parseDate = function parseDate(d) {
    function foo(d) {
        if(typeof d === 'string') { return Date.parse(d.replace(/-/g,'/')); }
        if(!(d instanceof Array)) { throw new Error("parseDate: parameter must be arrays of strings"); }
        var ret = [],k;
        for(k=0;k<d.length;k++) { ret[k] = foo(d[k]); }
        return ret;
    }
    return foo(d);
}

numeric.parseFloat = function parseFloat_(d) {
    function foo(d) {
        if(typeof d === 'string') { return parseFloat(d); }
        if(!(d instanceof Array)) { throw new Error("parseFloat: parameter must be arrays of strings"); }
        var ret = [],k;
        for(k=0;k<d.length;k++) { ret[k] = foo(d[k]); }
        return ret;
    }
    return foo(d);
}

numeric.parseCSV = function parseCSV(t) {
    var foo = t.split('\n');
    var j,k;
    var ret = [];
    var pat = /(([^'",]*)|('[^']*')|("[^"]*")),/g;
    var patnum = /^\s*(([+-]?[0-9]+(\.[0-9]*)?(e[+-]?[0-9]+)?)|([+-]?[0-9]*(\.[0-9]+)?(e[+-]?[0-9]+)?))\s*$/;
    var stripper = function(n) { return n.substr(0,n.length-1); }
    var count = 0;
    for(k=0;k<foo.length;k++) {
      var bar = (foo[k]+",").match(pat),baz;
      if(bar.length>0) {
          ret[count] = [];
          for(j=0;j<bar.length;j++) {
              baz = stripper(bar[j]);
              if(patnum.test(baz)) { ret[count][j] = parseFloat(baz); }
              else ret[count][j] = baz;
          }
          count++;
      }
    }
    return ret;
}

numeric.toCSV = function toCSV(A) {
    var s = numeric.dim(A);
    var i,j,m,n,row,ret;
    m = s[0];
    n = s[1];
    ret = [];
    for(i=0;i<m;i++) {
        row = [];
        for(j=0;j<m;j++) { row[j] = A[i][j].toString(); }
        ret[i] = row.join(', ');
    }
    return ret.join('\n')+'\n';
}

numeric.getURL = function getURL(url) {
    var client = new XMLHttpRequest();
    client.open("GET",url,false);
    client.send();
    return client;
}

numeric.imageURL = function imageURL(img) {
    function base64(A) {
        var n = A.length, i,x,y,z,p,q,r,s;
        var key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var ret = "";
        for(i=0;i<n;i+=3) {
            x = A[i];
            y = A[i+1];
            z = A[i+2];
            p = x >> 2;
            q = ((x & 3) << 4) + (y >> 4);
            r = ((y & 15) << 2) + (z >> 6);
            s = z & 63;
            if(i+1>=n) { r = s = 64; }
            else if(i+2>=n) { s = 64; }
            ret += key.charAt(p) + key.charAt(q) + key.charAt(r) + key.charAt(s);
            }
        return ret;
    }
    function crc32Array (a,from,to) {
        if(typeof from === "undefined") { from = 0; }
        if(typeof to === "undefined") { to = a.length; }
        var table = [0x00000000, 0x77073096, 0xEE0E612C, 0x990951BA, 0x076DC419, 0x706AF48F, 0xE963A535, 0x9E6495A3,
                     0x0EDB8832, 0x79DCB8A4, 0xE0D5E91E, 0x97D2D988, 0x09B64C2B, 0x7EB17CBD, 0xE7B82D07, 0x90BF1D91, 
                     0x1DB71064, 0x6AB020F2, 0xF3B97148, 0x84BE41DE, 0x1ADAD47D, 0x6DDDE4EB, 0xF4D4B551, 0x83D385C7,
                     0x136C9856, 0x646BA8C0, 0xFD62F97A, 0x8A65C9EC, 0x14015C4F, 0x63066CD9, 0xFA0F3D63, 0x8D080DF5, 
                     0x3B6E20C8, 0x4C69105E, 0xD56041E4, 0xA2677172, 0x3C03E4D1, 0x4B04D447, 0xD20D85FD, 0xA50AB56B, 
                     0x35B5A8FA, 0x42B2986C, 0xDBBBC9D6, 0xACBCF940, 0x32D86CE3, 0x45DF5C75, 0xDCD60DCF, 0xABD13D59, 
                     0x26D930AC, 0x51DE003A, 0xC8D75180, 0xBFD06116, 0x21B4F4B5, 0x56B3C423, 0xCFBA9599, 0xB8BDA50F,
                     0x2802B89E, 0x5F058808, 0xC60CD9B2, 0xB10BE924, 0x2F6F7C87, 0x58684C11, 0xC1611DAB, 0xB6662D3D,
                     0x76DC4190, 0x01DB7106, 0x98D220BC, 0xEFD5102A, 0x71B18589, 0x06B6B51F, 0x9FBFE4A5, 0xE8B8D433,
                     0x7807C9A2, 0x0F00F934, 0x9609A88E, 0xE10E9818, 0x7F6A0DBB, 0x086D3D2D, 0x91646C97, 0xE6635C01, 
                     0x6B6B51F4, 0x1C6C6162, 0x856530D8, 0xF262004E, 0x6C0695ED, 0x1B01A57B, 0x8208F4C1, 0xF50FC457, 
                     0x65B0D9C6, 0x12B7E950, 0x8BBEB8EA, 0xFCB9887C, 0x62DD1DDF, 0x15DA2D49, 0x8CD37CF3, 0xFBD44C65, 
                     0x4DB26158, 0x3AB551CE, 0xA3BC0074, 0xD4BB30E2, 0x4ADFA541, 0x3DD895D7, 0xA4D1C46D, 0xD3D6F4FB, 
                     0x4369E96A, 0x346ED9FC, 0xAD678846, 0xDA60B8D0, 0x44042D73, 0x33031DE5, 0xAA0A4C5F, 0xDD0D7CC9, 
                     0x5005713C, 0x270241AA, 0xBE0B1010, 0xC90C2086, 0x5768B525, 0x206F85B3, 0xB966D409, 0xCE61E49F, 
                     0x5EDEF90E, 0x29D9C998, 0xB0D09822, 0xC7D7A8B4, 0x59B33D17, 0x2EB40D81, 0xB7BD5C3B, 0xC0BA6CAD, 
                     0xEDB88320, 0x9ABFB3B6, 0x03B6E20C, 0x74B1D29A, 0xEAD54739, 0x9DD277AF, 0x04DB2615, 0x73DC1683, 
                     0xE3630B12, 0x94643B84, 0x0D6D6A3E, 0x7A6A5AA8, 0xE40ECF0B, 0x9309FF9D, 0x0A00AE27, 0x7D079EB1, 
                     0xF00F9344, 0x8708A3D2, 0x1E01F268, 0x6906C2FE, 0xF762575D, 0x806567CB, 0x196C3671, 0x6E6B06E7, 
                     0xFED41B76, 0x89D32BE0, 0x10DA7A5A, 0x67DD4ACC, 0xF9B9DF6F, 0x8EBEEFF9, 0x17B7BE43, 0x60B08ED5, 
                     0xD6D6A3E8, 0xA1D1937E, 0x38D8C2C4, 0x4FDFF252, 0xD1BB67F1, 0xA6BC5767, 0x3FB506DD, 0x48B2364B, 
                     0xD80D2BDA, 0xAF0A1B4C, 0x36034AF6, 0x41047A60, 0xDF60EFC3, 0xA867DF55, 0x316E8EEF, 0x4669BE79, 
                     0xCB61B38C, 0xBC66831A, 0x256FD2A0, 0x5268E236, 0xCC0C7795, 0xBB0B4703, 0x220216B9, 0x5505262F, 
                     0xC5BA3BBE, 0xB2BD0B28, 0x2BB45A92, 0x5CB36A04, 0xC2D7FFA7, 0xB5D0CF31, 0x2CD99E8B, 0x5BDEAE1D, 
                     0x9B64C2B0, 0xEC63F226, 0x756AA39C, 0x026D930A, 0x9C0906A9, 0xEB0E363F, 0x72076785, 0x05005713, 
                     0x95BF4A82, 0xE2B87A14, 0x7BB12BAE, 0x0CB61B38, 0x92D28E9B, 0xE5D5BE0D, 0x7CDCEFB7, 0x0BDBDF21, 
                     0x86D3D2D4, 0xF1D4E242, 0x68DDB3F8, 0x1FDA836E, 0x81BE16CD, 0xF6B9265B, 0x6FB077E1, 0x18B74777, 
                     0x88085AE6, 0xFF0F6A70, 0x66063BCA, 0x11010B5C, 0x8F659EFF, 0xF862AE69, 0x616BFFD3, 0x166CCF45, 
                     0xA00AE278, 0xD70DD2EE, 0x4E048354, 0x3903B3C2, 0xA7672661, 0xD06016F7, 0x4969474D, 0x3E6E77DB, 
                     0xAED16A4A, 0xD9D65ADC, 0x40DF0B66, 0x37D83BF0, 0xA9BCAE53, 0xDEBB9EC5, 0x47B2CF7F, 0x30B5FFE9, 
                     0xBDBDF21C, 0xCABAC28A, 0x53B39330, 0x24B4A3A6, 0xBAD03605, 0xCDD70693, 0x54DE5729, 0x23D967BF, 
                     0xB3667A2E, 0xC4614AB8, 0x5D681B02, 0x2A6F2B94, 0xB40BBE37, 0xC30C8EA1, 0x5A05DF1B, 0x2D02EF8D];
     
        var crc = -1, y = 0, n = a.length,i;

        for (i = from; i < to; i++) {
            y = (crc ^ a[i]) & 0xFF;
            crc = (crc >>> 8) ^ table[y];
        }
     
        return crc ^ (-1);
    }

    var h = img[0].length, w = img[0][0].length, s1, s2, next,k,length,a,b,i,j,adler32,crc32;
    var stream = [
                  137, 80, 78, 71, 13, 10, 26, 10,                           //  0: PNG signature
                  0,0,0,13,                                                  //  8: IHDR Chunk length
                  73, 72, 68, 82,                                            // 12: "IHDR" 
                  (w >> 24) & 255, (w >> 16) & 255, (w >> 8) & 255, w&255,   // 16: Width
                  (h >> 24) & 255, (h >> 16) & 255, (h >> 8) & 255, h&255,   // 20: Height
                  8,                                                         // 24: bit depth
                  2,                                                         // 25: RGB
                  0,                                                         // 26: deflate
                  0,                                                         // 27: no filter
                  0,                                                         // 28: no interlace
                  -1,-2,-3,-4,                                               // 29: CRC
                  -5,-6,-7,-8,                                               // 33: IDAT Chunk length
                  73, 68, 65, 84,                                            // 37: "IDAT"
                  // RFC 1950 header starts here
                  8,                                                         // 41: RFC1950 CMF
                  29                                                         // 42: RFC1950 FLG
                  ];
    crc32 = crc32Array(stream,12,29);
    stream[29] = (crc32>>24)&255;
    stream[30] = (crc32>>16)&255;
    stream[31] = (crc32>>8)&255;
    stream[32] = (crc32)&255;
    s1 = 1;
    s2 = 0;
    for(i=0;i<h;i++) {
        if(i<h-1) { stream.push(0); }
        else { stream.push(1); }
        a = (3*w+1+(i===0))&255; b = ((3*w+1+(i===0))>>8)&255;
        stream.push(a); stream.push(b);
        stream.push((~a)&255); stream.push((~b)&255);
        if(i===0) stream.push(0);
        for(j=0;j<w;j++) {
            for(k=0;k<3;k++) {
                a = img[k][i][j];
                if(a>255) a = 255;
                else if(a<0) a=0;
                else a = Math.round(a);
                s1 = (s1 + a )%65521;
                s2 = (s2 + s1)%65521;
                stream.push(a);
            }
        }
        stream.push(0);
    }
    adler32 = (s2<<16)+s1;
    stream.push((adler32>>24)&255);
    stream.push((adler32>>16)&255);
    stream.push((adler32>>8)&255);
    stream.push((adler32)&255);
    length = stream.length - 41;
    stream[33] = (length>>24)&255;
    stream[34] = (length>>16)&255;
    stream[35] = (length>>8)&255;
    stream[36] = (length)&255;
    crc32 = crc32Array(stream,37);
    stream.push((crc32>>24)&255);
    stream.push((crc32>>16)&255);
    stream.push((crc32>>8)&255);
    stream.push((crc32)&255);
    stream.push(0);
    stream.push(0);
    stream.push(0);
    stream.push(0);
//    a = stream.length;
    stream.push(73);  // I
    stream.push(69);  // E
    stream.push(78);  // N
    stream.push(68);  // D
    stream.push(174); // CRC1
    stream.push(66);  // CRC2
    stream.push(96);  // CRC3
    stream.push(130); // CRC4
    return 'data:image/png;base64,'+base64(stream);
}

// 2. Linear algebra with Arrays.
numeric._dim = function _dim(x) {
    var ret = [];
    while(typeof x === "object") { ret.push(x.length); x = x[0]; }
    return ret;
}

numeric.dim = function dim(x) {
    var y,z;
    if(typeof x === "object") {
        y = x[0];
        if(typeof y === "object") {
            z = y[0];
            if(typeof z === "object") {
                return numeric._dim(x);
            }
            return [x.length,y.length];
        }
        return [x.length];
    }
    return [];
}

numeric.mapreduce = function mapreduce(body,init) {
    return Function('x','accum','_s','_k',
            'if(typeof accum === "undefined") accum = '+init+';\n'+
            'if(typeof x === "number") { var xi = x; '+body+'; return accum; }\n'+
            'if(typeof _s === "undefined") _s = numeric.dim(x);\n'+
            'if(typeof _k === "undefined") _k = 0;\n'+
            'var _n = _s[_k];\n'+
            'var i,xi;\n'+
            'if(_k < _s.length-1) {\n'+
            '    for(i=_n-1;i>=0;i--) {\n'+
            '        accum = arguments.callee(x[i],accum,_s,_k+1);\n'+
            '    }'+
            '    return accum;\n'+
            '}\n'+
            'for(i=_n-1;i>=1;i-=2) { \n'+
            '    xi = x[i];\n'+
            '    '+body+';\n'+
            '    xi = x[i-1];\n'+
            '    '+body+';\n'+
            '}\n'+
            'if(i === 0) {\n'+
            '    xi = x[i];\n'+
            '    '+body+'\n'+
            '}\n'+
            'return accum;'
            );
}
numeric.mapreduce2 = function mapreduce2(body,setup) {
    return Function('x',
            'var n = x.length;\n'+
            'var i,xi;\n'+setup+';\n'+
            'for(i=n-1;i!==-1;--i) { \n'+
            '    xi = x[i];\n'+
            '    '+body+';\n'+
            '}\n'+
            'return accum;'
            );
}


numeric.same = function same(x,y) {
    var i,n;
    if(!(x instanceof Array) || !(y instanceof Array)) { return false; }
    n = x.length;
    if(n !== y.length) { return false; }
    for(i=0;i<n;i++) {
        if(x[i] === y[i]) { continue; }
        if(typeof x[i] === "object") { if(!same(x[i],y[i])) return false; }
        else { return false; }
    }
    return true;
}

numeric.rep = function rep(s,v,k) {
    if(typeof k === "undefined") { k=0; }
    var n = s[k], ret = Array(n), i;
    if(k === s.length-1) {
        for(i=n-2;i>=0;i-=2) { ret[i+1] = v; ret[i] = v; }
        if(i===-1) { ret[0] = v; }
        return ret;
    }
    for(i=n-1;i>=0;i--) { ret[i] = numeric.rep(s,v,k+1); }
    return ret;
}


numeric.dotMMsmall = function dotMMsmall(x,y) {
    var i,j,k,p,q,r,ret,foo,bar,woo,i0,k0,p0,r0;
    p = x.length; q = y.length; r = y[0].length;
    ret = Array(p);
    for(i=p-1;i>=0;i--) {
        foo = Array(r);
        bar = x[i];
        for(k=r-1;k>=0;k--) {
            woo = bar[q-1]*y[q-1][k];
            for(j=q-2;j>=1;j-=2) {
                i0 = j-1;
                woo += bar[j]*y[j][k] + bar[i0]*y[i0][k];
            }
            if(j===0) { woo += bar[0]*y[0][k]; }
            foo[k] = woo;
        }
        ret[i] = foo;
    }
    return ret;
}
numeric._getCol = function _getCol(A,j,x) {
    var n = A.length, i;
    for(i=n-1;i>0;--i) {
        x[i] = A[i][j];
        --i;
        x[i] = A[i][j];
    }
    if(i===0) x[0] = A[0][j];
}
numeric.dotMMbig = function dotMMbig(x,y){
    var gc = numeric._getCol, p = y.length, v = Array(p);
    var m = x.length, n = y[0].length, A = new Array(m), xj;
    var VV = numeric.dotVV;
    var i,j,k,z;
    --p;
    --m;
    for(i=m;i!==-1;--i) A[i] = Array(n);
    --n;
    for(i=n;i!==-1;--i) {
        gc(y,i,v);
        for(j=m;j!==-1;--j) {
            z=0;
            xj = x[j];
            A[j][i] = VV(xj,v);
        }
    }
    return A;
}

numeric.dotMV = function dotMV(x,y) {
    var p = x.length, q = y.length,i;
    var ret = Array(p), dotVV = numeric.dotVV;
    for(i=p-1;i>=0;i--) { ret[i] = dotVV(x[i],y); }
    return ret;
}

numeric.dotVM = function dotVM(x,y) {
    var i,j,k,p,q,r,ret,foo,bar,woo,i0,k0,p0,r0,s1,s2,s3,baz,accum;
    p = x.length; q = y[0].length;
    ret = Array(q);
    for(k=q-1;k>=0;k--) {
        woo = x[p-1]*y[p-1][k];
        for(j=p-2;j>=1;j-=2) {
            i0 = j-1;
            woo += x[j]*y[j][k] + x[i0]*y[i0][k];
        }
        if(j===0) { woo += x[0]*y[0][k]; }
        ret[k] = woo;
    }
    return ret;
}

numeric.dotVV = function dotVV(x,y) {
    var i,n=x.length,i1,ret = x[n-1]*y[n-1];
    for(i=n-2;i>=1;i-=2) {
        i1 = i-1;
        ret += x[i]*y[i] + x[i1]*y[i1];
    }
    if(i===0) { ret += x[0]*y[0]; }
    return ret;
}

numeric.dot = function dot(x,y) {
    var d = numeric.dim;
    switch(d(x).length*1000+d(y).length) {
    case 2002:
        if(y.length < 10) return numeric.dotMMsmall(x,y);
        else return numeric.dotMMbig(x,y);
    case 2001: return numeric.dotMV(x,y);
    case 1002: return numeric.dotVM(x,y);
    case 1001: return numeric.dotVV(x,y);
    case 1000: return numeric.mulVS(x,y);
    case 1: return numeric.mulSV(x,y);
    case 0: return x*y;
    default: throw new Error('numeric.dot only works on vectors and matrices');
    }
}

numeric.diag = function diag(d) {
    var i,i1,j,n = d.length, A = Array(n), Ai;
    for(i=n-1;i>=0;i--) {
        Ai = Array(n);
        i1 = i+2;
        for(j=n-1;j>=i1;j-=2) {
            Ai[j] = 0;
            Ai[j-1] = 0;
        }
        if(j>i) { Ai[j] = 0; }
        Ai[i] = d[i];
        for(j=i-1;j>=1;j-=2) {
            Ai[j] = 0;
            Ai[j-1] = 0;
        }
        if(j===0) { Ai[0] = 0; }
        A[i] = Ai;
    }
    return A;
}
numeric.getDiag = function(A) {
    var n = Math.min(A.length,A[0].length),i,ret = Array(n);
    for(i=n-1;i>=1;--i) {
        ret[i] = A[i][i];
        --i;
        ret[i] = A[i][i];
    }
    if(i===0) {
        ret[0] = A[0][0];
    }
    return ret;
}

numeric.identity = function identity(n) { return numeric.diag(numeric.rep([n],1)); }
numeric.pointwise = function pointwise(params,body,setup) {
    if(typeof setup === "undefined") { setup = ""; }
    var fun = [];
    var k;
    var avec = /\[i\]$/,p,thevec = '';
    var haveret = false;
    for(k=0;k<params.length;k++) {
        if(avec.test(params[k])) {
            p = params[k].substring(0,params[k].length-3);
            thevec = p;
        } else { p = params[k]; }
        if(p==='ret') haveret = true;
        fun.push(p);
    }
    fun[params.length] = '_s';
    fun[params.length+1] = '_k';
    fun[params.length+2] = (
            'if(typeof _s === "undefined") _s = numeric.dim('+thevec+');\n'+
            'if(typeof _k === "undefined") _k = 0;\n'+
            'var _n = _s[_k];\n'+
            'var i'+(haveret?'':', ret = Array(_n)')+';\n'+
            'if(_k < _s.length-1) {\n'+
            '    for(i=_n-1;i>=0;i--) ret[i] = arguments.callee('+params.join(',')+',_s,_k+1);\n'+
            '    return ret;\n'+
            '}\n'+
            setup+'\n'+
            'for(i=_n-1;i!==-1;--i) {\n'+
            '    '+body+'\n'+
            '}\n'+
            'return ret;'
            );
    return Function.apply(null,fun);
}
numeric.pointwise2 = function pointwise2(params,body,setup) {
    if(typeof setup === "undefined") { setup = ""; }
    var fun = [];
    var k;
    var avec = /\[i\]$/,p,thevec = '';
    var haveret = false;
    for(k=0;k<params.length;k++) {
        if(avec.test(params[k])) {
            p = params[k].substring(0,params[k].length-3);
            thevec = p;
        } else { p = params[k]; }
        if(p==='ret') haveret = true;
        fun.push(p);
    }
    fun[params.length] = (
            'var _n = '+thevec+'.length;\n'+
            'var i'+(haveret?'':', ret = Array(_n)')+';\n'+
            setup+'\n'+
            'for(i=_n-1;i!==-1;--i) {\n'+
            body+'\n'+
            '}\n'+
            'return ret;'
            );
    return Function.apply(null,fun);
}
numeric._biforeach = (function _biforeach(x,y,s,k,f) {
    if(k === s.length-1) { f(x,y); return; }
    var i,n=s[k];
    for(i=n-1;i>=0;i--) { _biforeach(typeof x==="object"?x[i]:x,typeof y==="object"?y[i]:y,s,k+1,f); }
});
numeric._biforeach2 = (function _biforeach2(x,y,s,k,f) {
    if(k === s.length-1) { return f(x,y); }
    var i,n=s[k],ret = Array(n);
    for(i=n-1;i>=0;--i) { ret[i] = _biforeach2(typeof x==="object"?x[i]:x,typeof y==="object"?y[i]:y,s,k+1,f); }
    return ret;
});
numeric._foreach = (function _foreach(x,s,k,f) {
    if(k === s.length-1) { f(x); return; }
    var i,n=s[k];
    for(i=n-1;i>=0;i--) { _foreach(x[i],s,k+1,f); }
});
numeric._foreach2 = (function _foreach2(x,s,k,f) {
    if(k === s.length-1) { return f(x); }
    var i,n=s[k], ret = Array(n);
    for(i=n-1;i>=0;i--) { ret[i] = _foreach2(x[i],s,k+1,f); }
    return ret;
});

/*numeric.anyV = numeric.mapreduce('if(xi) return true;','false');
numeric.allV = numeric.mapreduce('if(!xi) return false;','true');
numeric.any = function(x) { if(typeof x.length === "undefined") return x; return numeric.anyV(x); }
numeric.all = function(x) { if(typeof x.length === "undefined") return x; return numeric.allV(x); }*/

numeric.ops2 = {
        add: '+',
        sub: '-',
        mul: '*',
        div: '/',
        mod: '%',
        and: '&&',
        or:  '||',
        eq:  '===',
        neq: '!==',
        lt:  '<',
        gt:  '>',
        leq: '<=',
        geq: '>=',
        band: '&',
        bor: '|',
        bxor: '^',
        lshift: '<<',
        rshift: '>>',
        rrshift: '>>>'
};
numeric.opseq = {
        addeq: '+=',
        subeq: '-=',
        muleq: '*=',
        diveq: '/=',
        modeq: '%=',
        lshifteq: '<<=',
        rshifteq: '>>=',
        rrshifteq: '>>>=',
        bandeq: '&=',
        boreq: '|=',
        bxoreq: '^='
};
numeric.mathfuns = ['abs','acos','asin','atan','ceil','cos',
                    'exp','floor','log','round','sin','sqrt','tan',
                    'isNaN','isFinite'];
numeric.mathfuns2 = ['atan2','pow','max','min'];
numeric.ops1 = {
        neg: '-',
        not: '!',
        bnot: '~',
        clone: ''
};
numeric.mapreducers = {
        any: ['if(xi) return true;','var accum = false;'],
        all: ['if(!xi) return false;','var accum = true;'],
        sum: ['accum += xi;','var accum = 0;'],
        prod: ['accum *= xi;','var accum = 1;'],
        norm2Squared: ['accum += xi*xi;','var accum = 0;'],
        norminf: ['accum = max(accum,abs(xi));','var accum = 0, max = Math.max, abs = Math.abs;'],
        norm1: ['accum += abs(xi)','var accum = 0, abs = Math.abs;'],
        sup: ['accum = max(accum,xi);','var accum = -Infinity, max = Math.max;'],
        inf: ['accum = min(accum,xi);','var accum = Infinity, min = Math.min;']
};

(function () {
    var i,o;
    for(i=0;i<numeric.mathfuns2.length;++i) {
        o = numeric.mathfuns2[i];
        numeric.ops2[o] = o;
    }
    for(i in numeric.ops2) {
        if(numeric.ops2.hasOwnProperty(i)) {
            o = numeric.ops2[i];
            var code, codeeq, setup = '';
            if(numeric.myIndexOf.call(numeric.mathfuns2,i)!==-1) {
                setup = 'var '+o+' = Math.'+o+';\n';
                code = function(r,x,y) { return r+' = '+o+'('+x+','+y+')'; };
                codeeq = function(x,y) { return x+' = '+o+'('+x+','+y+')'; };
            } else {
                code = function(r,x,y) { return r+' = '+x+' '+o+' '+y; };
                if(numeric.opseq.hasOwnProperty(i+'eq')) {
                    codeeq = function(x,y) { return x+' '+o+'= '+y; };
                } else {
                    codeeq = function(x,y) { return x+' = '+x+' '+o+' '+y; };                    
                }
            }
            numeric[i+'VV'] = numeric.pointwise2(['x[i]','y[i]'],code('ret[i]','x[i]','y[i]'),setup);
            numeric[i+'SV'] = numeric.pointwise2(['x','y[i]'],code('ret[i]','x','y[i]'),setup);
            numeric[i+'VS'] = numeric.pointwise2(['x[i]','y'],code('ret[i]','x[i]','y'),setup);
            numeric[i] = Function(
                    'var n = arguments.length, i, x = arguments[0], y;\n'+
                    'var VV = numeric.'+i+'VV, VS = numeric.'+i+'VS, SV = numeric.'+i+'SV;\n'+
                    'var dim = numeric.dim;\n'+
                    'for(i=1;i!==n;++i) { \n'+
                    '  y = arguments[i];\n'+
                    '  if(typeof x === "object") {\n'+
                    '      if(typeof y === "object") x = numeric._biforeach2(x,y,dim(x),0,VV);\n'+
                    '      else x = numeric._biforeach2(x,y,dim(x),0,VS);\n'+
                    '  } else if(typeof y === "object") x = numeric._biforeach2(x,y,dim(y),0,SV);\n'+
                    '  else '+codeeq('x','y')+'\n'+
                    '}\nreturn x;\n');
            numeric[o] = numeric[i];
            numeric[i+'eqV'] = numeric.pointwise2(['ret[i]','x[i]'], codeeq('ret[i]','x[i]'),setup);
            numeric[i+'eqS'] = numeric.pointwise2(['ret[i]','x'], codeeq('ret[i]','x'),setup);
            numeric[i+'eq'] = Function(
                    'var n = arguments.length, i, x = arguments[0], y;\n'+
                    'var V = numeric.'+i+'eqV, S = numeric.'+i+'eqS\n'+
                    'var s = numeric.dim(x);\n'+
                    'for(i=1;i!==n;++i) { \n'+
                    '  y = arguments[i];\n'+
                    '  if(typeof y === "object") numeric._biforeach(x,y,s,0,V);\n'+
                    '  else numeric._biforeach(x,y,s,0,S);\n'+
                    '}\nreturn x;\n');
        }
    }
    for(i=0;i<numeric.mathfuns2.length;++i) {
        o = numeric.mathfuns2[i];
        delete numeric.ops2[o];
    }
    for(i=0;i<numeric.mathfuns.length;++i) {
        o = numeric.mathfuns[i];
        numeric.ops1[o] = o;
    }
    for(i in numeric.ops1) {
        if(numeric.ops1.hasOwnProperty(i)) {
            setup = '';
            o = numeric.ops1[i];
            if(numeric.myIndexOf.call(numeric.mathfuns,i)!==-1) {
                if(Math.hasOwnProperty(o)) setup = 'var '+o+' = Math.'+o+';\n';
            }
            numeric[i+'eqV'] = numeric.pointwise2(['ret[i]'],'ret[i] = '+o+'(ret[i]);',setup);
            numeric[i+'eq'] = Function('x',
                    'if(typeof x !== "object") return '+o+'x\n'+
                    'var i;\n'+
                    'var V = numeric.'+i+'eqV;\n'+
                    'var s = numeric.dim(x);\n'+
                    'numeric._foreach(x,s,0,V);\n'+
                    'return x;\n');
            numeric[i+'V'] = numeric.pointwise2(['x[i]'],'ret[i] = '+o+'(x[i]);',setup);
            numeric[i] = Function('x',
                    'if(typeof x !== "object") return '+o+'(x)\n'+
                    'var i;\n'+
                    'var V = numeric.'+i+'V;\n'+
                    'var s = numeric.dim(x);\n'+
                    'return numeric._foreach2(x,s,0,V);\n');
        }
    }
    for(i=0;i<numeric.mathfuns.length;++i) {
        o = numeric.mathfuns[i];
        delete numeric.ops1[o];
    }
    for(i in numeric.mapreducers) {
        if(numeric.mapreducers.hasOwnProperty(i)) {
            o = numeric.mapreducers[i];
            numeric[i+'V'] = numeric.mapreduce2(o[0],o[1]);
            numeric[i] = Function('x','s','k',
                    o[1]+
                    'if(typeof x !== "object") {'+
                    '    xi = x;\n'+
                    o[0]+';\n'+
                    '    return accum;\n'+
                    '}'+
                    'if(typeof s === "undefined") s = numeric.dim(x);\n'+
                    'if(typeof k === "undefined") k = 0;\n'+
                    'if(k === s.length-1) return numeric.'+i+'V(x);\n'+
                    'var xi;\n'+
                    'var n = x.length, i;\n'+
                    'for(i=n-1;i!==-1;--i) {\n'+
                    '   xi = arguments.callee(x[i]);\n'+
                    o[0]+';\n'+
                    '}\n'+
                    'return accum;\n');
        }
    }
}());

numeric.truncVV = numeric.pointwise(['x[i]','y[i]'],'ret[i] = round(x[i]/y[i])*y[i];','var round = Math.round;');
numeric.truncVS = numeric.pointwise(['x[i]','y'],'ret[i] = round(x[i]/y)*y;','var round = Math.round;');
numeric.truncSV = numeric.pointwise(['x','y[i]'],'ret[i] = round(x/y[i])*y[i];','var round = Math.round;');
numeric.trunc = function trunc(x,y) {
    if(typeof x === "object") {
        if(typeof y === "object") return numeric.truncVV(x,y);
        return numeric.truncVS(x,y);
    }
    if (typeof y === "object") return numeric.truncSV(x,y);
    return Math.round(x/y)*y;
}

numeric.inv = function inv(x) {
    var s = numeric.dim(x), abs = Math.abs, m = s[0], n = s[1];
    var A = numeric.clone(x), Ai, Aj;
    var I = numeric.identity(m), Ii, Ij;
    var i,j,k,x;
    for(j=0;j<n;++j) {
        var i0 = -1;
        var v0 = -1;
        for(i=j;i!==m;++i) { k = abs(A[i][j]); if(k>v0) { i0 = i; v0 = k; } }
        Aj = A[i0]; A[i0] = A[j]; A[j] = Aj;
        Ij = I[i0]; I[i0] = I[j]; I[j] = Ij;
        x = Aj[j];
        for(k=j;k!==n;++k)    Aj[k] /= x; 
        for(k=n-1;k!==-1;--k) Ij[k] /= x;
        for(i=m-1;i!==-1;--i) {
            if(i!==j) {
                Ai = A[i];
                Ii = I[i];
                x = Ai[j];
                for(k=j+1;k!==n;++k)  Ai[k] -= Aj[k]*x;
                for(k=n-1;k>0;--k) { Ii[k] -= Ij[k]*x; --k; Ii[k] -= Ij[k]*x; }
                if(k===0) Ii[0] -= Ij[0]*x;
            }
        }
    }
    return I;
}

numeric.det = function det(x) {
    var s = numeric.dim(x);
    if(s.length !== 2 || s[0] !== s[1]) { throw new Error('numeric: det() only works on square matrices'); }
    var n = s[0], ret = 1,i,j,k,A = numeric.clone(x),Aj,Ai,alpha,temp,k1,k2,k3;
    for(j=0;j<n-1;j++) {
        k=j;
        for(i=j+1;i<n;i++) { if(Math.abs(A[i][j]) > Math.abs(A[k][j])) { k = i; } }
        if(k !== j) {
            temp = A[k]; A[k] = A[j]; A[j] = temp;
            ret *= -1;
        }
        Aj = A[j];
        for(i=j+1;i<n;i++) {
            Ai = A[i];
            alpha = Ai[j]/Aj[j];
            for(k=j+1;k<n-1;k+=2) {
                k1 = k+1;
                Ai[k] -= Aj[k]*alpha;
                Ai[k1] -= Aj[k1]*alpha;
            }
            if(k!==n) { Ai[k] -= Aj[k]*alpha; }
        }
        if(Aj[j] === 0) { return 0; }
        ret *= Aj[j];
    }
    return ret*A[j][j];
}

numeric.transpose = function transpose(x) {
    var i,j,m = x.length,n = x[0].length, ret=Array(n),A0,A1,Bj;
    for(j=0;j<n;j++) ret[j] = Array(m);
    for(i=m-1;i>=1;i-=2) {
        A1 = x[i];
        A0 = x[i-1];
        for(j=n-1;j>=1;--j) {
            Bj = ret[j]; Bj[i] = A1[j]; Bj[i-1] = A0[j];
            --j;
            Bj = ret[j]; Bj[i] = A1[j]; Bj[i-1] = A0[j];
        }
        if(j===0) {
            Bj = ret[0]; Bj[i] = A1[0]; Bj[i-1] = A0[0];
        }
    }
    if(i===0) {
        A0 = x[0];
        for(j=n-1;j>=1;--j) {
            ret[j][0] = A0[j];
            --j;
            ret[j][0] = A0[j];
        }
        if(j===0) { ret[0][0] = A0[0]; }
    }
    return ret;
}
numeric.negtranspose = function negtranspose(x) {
    var i,j,m = x.length,n = x[0].length, ret=Array(n),A0,A1,Bj;
    for(j=0;j<n;j++) ret[j] = Array(m);
    for(i=m-1;i>=1;i-=2) {
        A1 = x[i];
        A0 = x[i-1];
        for(j=n-1;j>=1;--j) {
            Bj = ret[j]; Bj[i] = -A1[j]; Bj[i-1] = -A0[j];
            --j;
            Bj = ret[j]; Bj[i] = -A1[j]; Bj[i-1] = -A0[j];
        }
        if(j===0) {
            Bj = ret[0]; Bj[i] = -A1[0]; Bj[i-1] = -A0[0];
        }
    }
    if(i===0) {
        A0 = x[0];
        for(j=n-1;j>=1;--j) {
            ret[j][0] = -A0[j];
            --j;
            ret[j][0] = -A0[j];
        }
        if(j===0) { ret[0][0] = -A0[0]; }
    }
    return ret;
}

numeric._random = function _random(s,k) {
    var i,n=s[k],ret=Array(n), rnd;
    if(k === s.length-1) {
        rnd = Math.random;
        for(i=n-1;i>=1;i-=2) {
            ret[i] = rnd();
            ret[i-1] = rnd();
        }
        if(i===0) { ret[0] = rnd(); }
        return ret;
    }
    for(i=n-1;i>=0;i--) ret[i] = _random(s,k+1);
    return ret;
}
numeric.random = function random(s) { return numeric._random(s,0); }

numeric.norm2 = function norm2(x) { return Math.sqrt(numeric.norm2Squared(x)); }

numeric.linspace = function linspace(a,b,n) {
    if(typeof n === "undefined") n = Math.max(Math.round(b-a)+1,1);
    if(n<2) { return n===1?[a]:[]; }
    var i,ret = Array(n);
    n--;
    for(i=n;i>=0;i--) { ret[i] = (i*b+(n-i)*a)/n; }
    return ret;
}

numeric.getBlock = function getBlock(x,from,to) {
    var s = numeric.dim(x);
    function foo(x,k) {
        var i,a = from[k], n = to[k]-a, ret = Array(n);
        if(k === s.length-1) {
            for(i=n;i>=0;i--) { ret[i] = x[i+a]; }
            return ret;
        }
        for(i=n;i>=0;i--) { ret[i] = foo(x[i+a],k+1); }
        return ret;
    }
    return foo(x,0);
}

numeric.setBlock = function setBlock(x,from,to,B) {
    var s = numeric.dim(x);
    function foo(x,y,k) {
        var i,a = from[k], n = to[k]-a;
        if(k === s.length-1) { for(i=n;i>=0;i--) { x[i+a] = y[i]; } }
        for(i=n;i>=0;i--) { foo(x[i+a],y[i],k+1); }
    }
    foo(x,B,0);
    return x;
}

numeric.getRange = function getRange(A,I,J) {
    var m = I.length, n = J.length;
    var i,j;
    var B = Array(m), Bi, AI;
    for(i=m-1;i!==-1;--i) {
        B[i] = Array(n);
        Bi = B[i];
        AI = A[I[i]];
        for(j=n-1;j!==-1;--j) Bi[j] = AI[J[j]];
    }
    return B;
}

numeric.blockMatrix = function blockMatrix(X) {
    var s = numeric.dim(X);
    if(s.length<4) return numeric.blockMatrix([X]);
    var m=s[0],n=s[1],M,N,i,j,Xij;
    M = 0; N = 0;
    for(i=0;i<m;++i) M+=X[i][0].length;
    for(j=0;j<n;++j) N+=X[0][j][0].length;
    var Z = Array(M);
    for(i=0;i<M;++i) Z[i] = Array(N);
    var I=0,J,ZI,k,l,Xijk;
    for(i=0;i<m;++i) {
        J=N;
        for(j=n-1;j!==-1;--j) {
            Xij = X[i][j];
            J -= Xij[0].length;
            for(k=Xij.length-1;k!==-1;--k) {
                Xijk = Xij[k];
                ZI = Z[I+k];
                for(l = Xijk.length-1;l!==-1;--l) ZI[J+l] = Xijk[l];
            }
        }
        I += X[i][0].length;
    }
    return Z;
}

numeric.tensor = function tensor(x,y) {
    if(typeof x === "number" || typeof y === "number") return numeric.mul(x,y);
    var s1 = numeric.dim(x), s2 = numeric.dim(y);
    if(s1.length !== 1 || s2.length !== 1) {
        throw new Error('numeric: tensor product is only defined for vectors');
    }
    var m = s1[0], n = s2[0], A = Array(m), Ai, i,j,xi;
    for(i=m-1;i>=0;i--) {
        Ai = Array(n);
        xi = x[i];
        for(j=n-1;j>=3;--j) {
            Ai[j] = xi * y[j];
            --j;
            Ai[j] = xi * y[j];
            --j;
            Ai[j] = xi * y[j];
            --j;
            Ai[j] = xi * y[j];
        }
        while(j>=0) { Ai[j] = xi * y[j]; --j; }
        A[i] = Ai;
    }
    return A;
}

// 3. The Tensor type T
numeric.T = function T(x,y) { this.x = x; this.y = y; }
numeric.t = function t(x,y) { return new numeric.T(x,y); }

numeric.Tbinop = function Tbinop(rr,rc,cr,cc,setup) {
    var io = numeric.indexOf;
    if(typeof setup !== "string") {
        var k;
        setup = '';
        for(k in numeric) {
            if(numeric.hasOwnProperty(k) && (rr.indexOf(k)>=0 || rc.indexOf(k)>=0 || cr.indexOf(k)>=0 || cc.indexOf(k)>=0) && k.length>1) {
                setup += 'var '+k+' = numeric.'+k+';\n';
            }
        }
    }
    return Function(['y'],
            'var x = this;\n'+
            'if(!(y instanceof numeric.T)) { y = new numeric.T(y); }\n'+
            setup+'\n'+
            'if(x.y) {'+
            '  if(y.y) {'+
            '    return new numeric.T('+cc+');\n'+
            '  }\n'+
            '  return new numeric.T('+cr+');\n'+
            '}\n'+
            'if(y.y) {\n'+
            '  return new numeric.T('+rc+');\n'+
            '}\n'+
            'return new numeric.T('+rr+');\n'
    );
}

numeric.T.prototype.add = numeric.Tbinop(
        'add(x.x,y.x)',
        'add(x.x,y.x),y.y',
        'add(x.x,y.x),x.y',
        'add(x.x,y.x),add(x.y,y.y)');
numeric.T.prototype.sub = numeric.Tbinop(
        'sub(x.x,y.x)',
        'sub(x.x,y.x),neg(y.y)',
        'sub(x.x,y.x),x.y',
        'sub(x.x,y.x),sub(x.y,y.y)');
numeric.T.prototype.mul = numeric.Tbinop(
        'mul(x.x,y.x)',
        'mul(x.x,y.x),mul(x.x,y.y)',
        'mul(x.x,y.x),mul(x.y,y.x)',
        'sub(mul(x.x,y.x),mul(x.y,y.y)),add(mul(x.x,y.y),mul(x.y,y.x))');

numeric.T.prototype.reciprocal = function reciprocal() {
    var mul = numeric.mul, div = numeric.div;
    if(this.y) {
        var d = numeric.add(mul(this.x,this.x),mul(this.y,this.y));
        return new numeric.T(div(this.x,d),div(numeric.neg(this.y),d));
    }
    return new T(div(1,this.x));
}
numeric.T.prototype.div = function div(y) {
    if(!(y instanceof numeric.T)) y = new numeric.T(y);
    if(y.y) { return this.mul(y.reciprocal()); }
    var div = numeric.div;
    if(this.y) { return new numeric.T(div(this.x,y.x),div(this.y,y.x)); }
    return new numeric.T(div(this.x,y.x));
}
numeric.T.prototype.dot = numeric.Tbinop(
        'dot(x.x,y.x)',
        'dot(x.x,y.x),dot(x.x,y.y)',
        'dot(x.x,y.x),dot(x.y,y.x)',
        'sub(dot(x.x,y.x),dot(x.y,y.y)),add(dot(x.x,y.y),dot(x.y,y.x))'
        );
numeric.T.prototype.transpose = function transpose() {
    var t = numeric.transpose, x = this.x, y = this.y;
    if(y) { return new numeric.T(t(x),t(y)); }
    return new numeric.T(t(x));
}
numeric.T.prototype.transjugate = function transjugate() {
    var t = numeric.transpose, x = this.x, y = this.y;
    if(y) { return new numeric.T(t(x),numeric.negtranspose(y)); }
    return new numeric.T(t(x));
}
numeric.Tunop = function Tunop(r,c,s) {
    if(typeof s !== "string") { s = ''; }
    return Function(
            'var x = this;\n'+
            s+'\n'+
            'if(x.y) {'+
            '  '+c+';\n'+
            '}\n'+
            r+';\n'
    );
}

numeric.T.prototype.exp = numeric.Tunop(
        'return new numeric.T(ex)',
        'return new numeric.T(mul(cos(x.y),ex),mul(sin(x.y),ex))',
        'var ex = numeric.exp(x.x), cos = numeric.cos, sin = numeric.sin, mul = numeric.mul;');
numeric.T.prototype.conj = numeric.Tunop(
        'return new numeric.T(x.x);',
        'return new numeric.T(x.x,numeric.neg(x.y));');
numeric.T.prototype.neg = numeric.Tunop(
        'return new numeric.T(neg(x.x));',
        'return new numeric.T(neg(x.x),neg(x.y));',
        'var neg = numeric.neg;');
numeric.T.prototype.sin = numeric.Tunop(
        'return new numeric.T(numeric.sin(x.x))',
        'return x.exp().sub(x.neg().exp()).div(new numeric.T(0,2));');
numeric.T.prototype.cos = numeric.Tunop(
        'return new numeric.T(numeric.cos(x.x))',
        'return x.exp().add(x.neg().exp()).div(2);');
numeric.T.prototype.abs = numeric.Tunop(
        'return new numeric.T(numeric.abs(x.x));',
        'return new numeric.T(numeric.sqrt(numeric.add(mul(x.x,x.x),mul(x.y,x.y))));',
        'var mul = numeric.mul;');
numeric.T.prototype.log = numeric.Tunop(
        'return new numeric.T(numeric.log(x.x));',
        'var theta = new numeric.T(numeric.atan2(x.y,x.x)), r = x.abs();\n'+
        'return new numeric.T(numeric.log(r.x),theta.x);');
numeric.T.prototype.norm2 = numeric.Tunop(
        'return numeric.norm2(x.x);',
        'var f = numeric.norm2Squared;\n'+
        'return Math.sqrt(f(x.x)+f(x.y));');
numeric.T.prototype.inv = function inv() {
    var A = this;
    if(typeof A.y === "undefined") { return new numeric.T(numeric.inv(A.x)); }
    var n = A.x.length, i, j, k;
    var Rx = numeric.identity(n),Ry = numeric.rep([n,n],0);
    var Ax = numeric.clone(A.x), Ay = numeric.clone(A.y);
    var Aix, Aiy, Ajx, Ajy, Rix, Riy, Rjx, Rjy;
    var i,j,k,d,d1,ax,ay,bx,by,temp;
    for(i=0;i<n;i++) {
        ax = Ax[i][i]; ay = Ay[i][i];
        d = ax*ax+ay*ay;
        k = i;
        for(j=i+1;j<n;j++) {
            ax = Ax[j][i]; ay = Ay[j][i];
            d1 = ax*ax+ay*ay;
            if(d1 > d) { k=j; d = d1; }
        }
        if(k!==i) {
            temp = Ax[i]; Ax[i] = Ax[k]; Ax[k] = temp;
            temp = Ay[i]; Ay[i] = Ay[k]; Ay[k] = temp;
            temp = Rx[i]; Rx[i] = Rx[k]; Rx[k] = temp;
            temp = Ry[i]; Ry[i] = Ry[k]; Ry[k] = temp;
        }
        Aix = Ax[i]; Aiy = Ay[i];
        Rix = Rx[i]; Riy = Ry[i];
        ax = Aix[i]; ay = Aiy[i];
        for(j=i+1;j<n;j++) {
            bx = Aix[j]; by = Aiy[j];
            Aix[j] = (bx*ax+by*ay)/d;
            Aiy[j] = (by*ax-bx*ay)/d;
        }
        for(j=0;j<n;j++) {
            bx = Rix[j]; by = Riy[j];
            Rix[j] = (bx*ax+by*ay)/d;
            Riy[j] = (by*ax-bx*ay)/d;
        }
        for(j=i+1;j<n;j++) {
            Ajx = Ax[j]; Ajy = Ay[j];
            Rjx = Rx[j]; Rjy = Ry[j];
            ax = Ajx[i]; ay = Ajy[i];
            for(k=i+1;k<n;k++) {
                bx = Aix[k]; by = Aiy[k];
                Ajx[k] -= bx*ax-by*ay;
                Ajy[k] -= by*ax+bx*ay;
            }
            for(k=0;k<n;k++) {
                bx = Rix[k]; by = Riy[k];
                Rjx[k] -= bx*ax-by*ay;
                Rjy[k] -= by*ax+bx*ay;
            }
        }
    }
    for(i=n-1;i>0;i--) {
        Rix = Rx[i]; Riy = Ry[i];
        for(j=i-1;j>=0;j--) {
            Rjx = Rx[j]; Rjy = Ry[j];
            ax = Ax[j][i]; ay = Ay[j][i];
            for(k=n-1;k>=0;k--) {
                bx = Rix[k]; by = Riy[k];
                Rjx[k] -= ax*bx - ay*by;
                Rjy[k] -= ax*by + ay*bx;
            }
        }
    }
    return new numeric.T(Rx,Ry);
}
numeric.T.prototype.get = function get(i) {
    var x = this.x, y = this.y, k = 0, ik, n = i.length;
    if(y) {
        while(k<n) {
            ik = i[k];
            x = x[ik];
            y = y[ik];
            k++;
        }
        return new numeric.T(x,y);
    }
    while(k<n) {
        ik = i[k];
        x = x[ik];
        k++;
    }
    return new numeric.T(x);
}
numeric.T.prototype.set = function set(i,v) {
    var x = this.x, y = this.y, k = 0, ik, n = i.length, vx = v.x, vy = v.y;
    if(n===0) {
        if(vy) { this.y = vy; }
        else if(y) { this.y = undefined; }
        this.x = x;
        return this;
    }
    if(vy) {
        if(y) { /* ok */ }
        else {
            y = numeric.rep(numeric.dim(x),0);
            this.y = y;
        }
        while(k<n-1) {
            ik = i[k];
            x = x[ik];
            y = y[ik];
            k++;
        }
        ik = i[k];
        x[ik] = vx;
        y[ik] = vy;
        return this;
    }
    if(y) {
        while(k<n-1) {
            ik = i[k];
            x = x[ik];
            y = y[ik];
            k++;
        }
        ik = i[k];
        x[ik] = vx;
        if(vx instanceof Array) y[ik] = numeric.rep(numeric.dim(vx),0);
        else y[ik] = 0;
        return this;
    }
    while(k<n-1) {
        ik = i[k];
        x = x[ik];
        k++;
    }
    ik = i[k];
    x[ik] = vx;
    return this;
}
numeric.T.prototype.getRows = function getRows(i0,i1) {
    var n = i1-i0+1, j;
    var rx = Array(n), ry, x = this.x, y = this.y;
    for(j=i0;j<=i1;j++) { rx[j-i0] = x[j]; }
    if(y) {
        ry = Array(n);
        for(j=i0;j<=i1;j++) { ry[j-i0] = y[j]; }
        return new numeric.T(rx,ry);
    }
    return new numeric.T(rx);
}
numeric.T.prototype.setRows = function setRows(i0,i1,A) {
    var j;
    var rx = this.x, ry = this.y, x = A.x, y = A.y;
    for(j=i0;j<=i1;j++) { rx[j] = x[j-i0]; }
    if(y) {
        if(!ry) { ry = numeric.rep(numeric.dim(rx),0); this.y = ry; }
        for(j=i0;j<=i1;j++) { ry[j] = y[j-i0]; }
    } else if(ry) {
        for(j=i0;j<=i1;j++) { ry[j] = numeric.rep([x[j-i0].length],0); }
    }
    return this;
}
numeric.T.prototype.getRow = function getRow(k) {
    var x = this.x, y = this.y;
    if(y) { return new numeric.T(x[k],y[k]); }
    return new numeric.T(x[k]);
}
numeric.T.prototype.setRow = function setRow(i,v) {
    var rx = this.x, ry = this.y, x = v.x, y = v.y;
    rx[i] = x;
    if(y) {
        if(!ry) { ry = numeric.rep(numeric.dim(rx),0); this.y = ry; }
        ry[i] = y;
    } else if(ry) {
        ry = numeric.rep([x.length],0);
    }
    return this;
}

numeric.T.prototype.getBlock = function getBlock(from,to) {
    var x = this.x, y = this.y, b = numeric.getBlock;
    if(y) { return new numeric.T(b(x,from,to),b(y,from,to)); }
    return new numeric.T(b(x,from,to));
}
numeric.T.prototype.setBlock = function setBlock(from,to,A) {
    if(!(A instanceof numeric.T)) A = new numeric.T(A);
    var x = this.x, y = this.y, b = numeric.setBlock, Ax = A.x, Ay = A.y;
    if(Ay) {
        if(!y) { this.y = numeric.rep(numeric.dim(this),0); y = this.y; }
        b(x,from,to,Ax);
        b(y,from,to,Ay);
        return this;
    }
    b(x,from,to,Ax);
    if(y) b(y,from,to,numeric.rep(numeric.dim(Ax),0));
}
numeric.T.rep = function rep(s,v) {
    var T = numeric.T;
    if(!(v instanceof T)) v = new T(v);
    var x = v.x, y = v.y, r = numeric.rep;
    if(y) return new T(r(s,x),r(s,y));
    return new T(r(s,x));
}
numeric.T.diag = function diag(d) {
    if(!(d instanceof numeric.T)) d = new numeric.T(d);
    var x = d.x, y = d.y, diag = numeric.diag;
    if(y) return new numeric.T(diag(x),diag(y));
    return new numeric.T(diag(x));
}
numeric.T.eig = function eig() {
    if(this.y) { throw new Error('eig: not implemented for complex matrices.'); }
    return numeric.eig(this.x);
}
numeric.T.identity = function identity(n) { return new numeric.T(numeric.identity(n)); }
numeric.T.prototype.getDiag = function getDiag() {
    var n = numeric;
    var x = this.x, y = this.y;
    if(y) { return new n.T(n.getDiag(x),n.getDiag(y)); }
    return new n.T(n.getDiag(x));
}

// 4. Eigenvalues of real matrices

numeric.house = function house(x) {
    var v = numeric.clone(x);
    var s = x[0] >= 0 ? 1 : -1;
    var alpha = s*numeric.norm2(x);
    v[0] += alpha;
    var foo = numeric.norm2(v);
    if(foo === 0) { /* this should not happen */ throw new Error('eig: internal error'); }
    return numeric.div(v,foo);
}

numeric.toUpperHessenberg = function toUpperHessenberg(me) {
    var s = numeric.dim(me);
    if(s.length !== 2 || s[0] !== s[1]) { throw new Error('numeric: toUpperHessenberg() only works on square matrices'); }
    var m = s[0], i,j,k,x,v,A = numeric.clone(me),B,C,Ai,Ci,Q = numeric.identity(m),Qi;
    for(j=0;j<m-2;j++) {
        x = Array(m-j-1);
        for(i=j+1;i<m;i++) { x[i-j-1] = A[i][j]; }
        if(numeric.norm2(x)>0) {
            v = numeric.house(x);
            B = numeric.getBlock(A,[j+1,j],[m-1,m-1]);
            C = numeric.tensor(v,numeric.dot(v,B));
            for(i=j+1;i<m;i++) { Ai = A[i]; Ci = C[i-j-1]; for(k=j;k<m;k++) Ai[k] -= 2*Ci[k-j]; }
            B = numeric.getBlock(A,[0,j+1],[m-1,m-1]);
            C = numeric.tensor(numeric.dot(B,v),v);
            for(i=0;i<m;i++) { Ai = A[i]; Ci = C[i]; for(k=j+1;k<m;k++) Ai[k] -= 2*Ci[k-j-1]; }
            B = Array(m-j-1);
            for(i=j+1;i<m;i++) B[i-j-1] = Q[i];
            C = numeric.tensor(v,numeric.dot(v,B));
            for(i=j+1;i<m;i++) { Qi = Q[i]; Ci = C[i-j-1]; for(k=0;k<m;k++) Qi[k] -= 2*Ci[k]; }
        }
    }
    return {H:A, Q:Q};
}

numeric.epsilon = 2.220446049250313e-16;

numeric.QRFrancis = function(H,maxiter) {
    if(typeof maxiter === "undefined") { maxiter = 10000; }
    H = numeric.clone(H);
    var H0 = numeric.clone(H);
    var s = numeric.dim(H),m=s[0],x,v,a,b,c,d,det,tr, Hloc, Q = numeric.identity(m), Qi, Hi, B, C, Ci,i,j,k,iter;
    if(m<3) { return {Q:Q, B:[ [0,m-1] ]}; }
    var epsilon = numeric.epsilon;
    for(iter=0;iter<maxiter;iter++) {
        for(j=0;j<m-1;j++) {
            if(Math.abs(H[j+1][j]) < epsilon*(Math.abs(H[j][j])+Math.abs(H[j+1][j+1]))) {
                var QH1 = numeric.QRFrancis(numeric.getBlock(H,[0,0],[j,j]),maxiter);
                var QH2 = numeric.QRFrancis(numeric.getBlock(H,[j+1,j+1],[m-1,m-1]),maxiter);
                B = Array(j+1);
                for(i=0;i<=j;i++) { B[i] = Q[i]; }
                C = numeric.dot(QH1.Q,B);
                for(i=0;i<=j;i++) { Q[i] = C[i]; }
                B = Array(m-j-1);
                for(i=j+1;i<m;i++) { B[i-j-1] = Q[i]; }
                C = numeric.dot(QH2.Q,B);
                for(i=j+1;i<m;i++) { Q[i] = C[i-j-1]; }
                return {Q:Q,B:QH1.B.concat(numeric.add(QH2.B,j+1))};
            }
        }
        a = H[m-2][m-2]; b = H[m-2][m-1];
        c = H[m-1][m-2]; d = H[m-1][m-1];
        tr = a+d;
        det = (a*d-b*c);
        Hloc = numeric.getBlock(H, [0,0], [2,2]);
        if(tr*tr>=4*det) {
            var s1,s2;
            s1 = 0.5*(tr+Math.sqrt(tr*tr-4*det));
            s2 = 0.5*(tr-Math.sqrt(tr*tr-4*det));
            Hloc = numeric.add(numeric.sub(numeric.dot(Hloc,Hloc),
                                           numeric.mul(Hloc,s1+s2)),
                               numeric.diag(numeric.rep([3],s1*s2)));
        } else {
            Hloc = numeric.add(numeric.sub(numeric.dot(Hloc,Hloc),
                                           numeric.mul(Hloc,tr)),
                               numeric.diag(numeric.rep([3],det)));
        }
        x = [Hloc[0][0],Hloc[1][0],Hloc[2][0]];
        v = numeric.house(x);
        B = [H[0],H[1],H[2]];
        C = numeric.tensor(v,numeric.dot(v,B));
        for(i=0;i<3;i++) { Hi = H[i]; Ci = C[i]; for(k=0;k<m;k++) Hi[k] -= 2*Ci[k]; }
        B = numeric.getBlock(H, [0,0],[m-1,2]);
        C = numeric.tensor(numeric.dot(B,v),v);
        for(i=0;i<m;i++) { Hi = H[i]; Ci = C[i]; for(k=0;k<3;k++) Hi[k] -= 2*Ci[k]; }
        B = [Q[0],Q[1],Q[2]];
        C = numeric.tensor(v,numeric.dot(v,B));
        for(i=0;i<3;i++) { Qi = Q[i]; Ci = C[i]; for(k=0;k<m;k++) Qi[k] -= 2*Ci[k]; }
        var J;
        for(j=0;j<m-2;j++) {
            for(k=j;k<=j+1;k++) {
                if(Math.abs(H[k+1][k]) < epsilon*(Math.abs(H[k][k])+Math.abs(H[k+1][k+1]))) {
                    var QH1 = numeric.QRFrancis(numeric.getBlock(H,[0,0],[k,k]),maxiter);
                    var QH2 = numeric.QRFrancis(numeric.getBlock(H,[k+1,k+1],[m-1,m-1]),maxiter);
                    B = Array(k+1);
                    for(i=0;i<=k;i++) { B[i] = Q[i]; }
                    C = numeric.dot(QH1.Q,B);
                    for(i=0;i<=k;i++) { Q[i] = C[i]; }
                    B = Array(m-k-1);
                    for(i=k+1;i<m;i++) { B[i-k-1] = Q[i]; }
                    C = numeric.dot(QH2.Q,B);
                    for(i=k+1;i<m;i++) { Q[i] = C[i-k-1]; }
                    return {Q:Q,B:QH1.B.concat(numeric.add(QH2.B,k+1))};
                }
            }
            J = Math.min(m-1,j+3);
            x = Array(J-j);
            for(i=j+1;i<=J;i++) { x[i-j-1] = H[i][j]; }
            v = numeric.house(x);
            B = numeric.getBlock(H, [j+1,j],[J,m-1]);
            C = numeric.tensor(v,numeric.dot(v,B));
            for(i=j+1;i<=J;i++) { Hi = H[i]; Ci = C[i-j-1]; for(k=j;k<m;k++) Hi[k] -= 2*Ci[k-j]; }
            B = numeric.getBlock(H, [0,j+1],[m-1,J]);
            C = numeric.tensor(numeric.dot(B,v),v);
            for(i=0;i<m;i++) { Hi = H[i]; Ci = C[i]; for(k=j+1;k<=J;k++) Hi[k] -= 2*Ci[k-j-1]; }
            B = Array(J-j);
            for(i=j+1;i<=J;i++) B[i-j-1] = Q[i];
            C = numeric.tensor(v,numeric.dot(v,B));
            for(i=j+1;i<=J;i++) { Qi = Q[i]; Ci = C[i-j-1]; for(k=0;k<m;k++) Qi[k] -= 2*Ci[k]; }
        }
    }
    throw new Error('numeric: eigenvalue iteration does not converge -- increase maxiter?');
}

numeric.eig = function eig(A,maxiter) {
    var QH = numeric.toUpperHessenberg(A);
    var QB = numeric.QRFrancis(QH.H,maxiter);
    var T = numeric.T;
    var n = A.length,i,k,flag = false,B = QB.B,H = numeric.dot(QB.Q,numeric.dot(QH.H,numeric.transpose(QB.Q)));
    var Q = new T(numeric.dot(QB.Q,QH.Q)),Q0;
    var m = B.length,j;
    var a,b,c,d,p1,p2,disc,x,y,p,q,n1,n2;
    var sqrt = Math.sqrt;
    for(k=0;k<m;k++) {
        i = B[k][0];
        if(i === B[k][1]) {
            // nothing
        } else {
            j = i+1;
            a = H[i][i];
            b = H[i][j];
            c = H[j][i];
            d = H[j][j];
            if(b === 0 && c === 0) continue;
            p1 = -a-d;
            p2 = a*d-b*c;
            disc = p1*p1-4*p2;
            if(disc>=0) {
                if(p1<0) x = -0.5*(p1-sqrt(disc));
                else     x = -0.5*(p1+sqrt(disc));
                n1 = (a-x)*(a-x)+b*b;
                n2 = c*c+(d-x)*(d-x);
                if(n1>n2) {
                    n1 = sqrt(n1);
                    p = (a-x)/n1;
                    q = b/n1;
                } else {
                    n2 = sqrt(n2);
                    p = c/n2;
                    q = (d-x)/n2;
                }
                Q0 = new T([[q,-p],[p,q]]);
                Q.setRows(i,j,Q0.dot(Q.getRows(i,j)));
            } else {
                x = -0.5*p1;
                y = 0.5*sqrt(-disc);
                n1 = (a-x)*(a-x)+b*b;
                n2 = c*c+(d-x)*(d-x);
                if(n1>n2) {
                    n1 = sqrt(n1+y*y);
                    p = (a-x)/n1;
                    q = b/n1;
                    x = 0;
                    y /= n1;
                } else {
                    n2 = sqrt(n2+y*y);
                    p = c/n2;
                    q = (d-x)/n2;
                    x = y/n2;
                    y = 0;
                }
                Q0 = new T([[q,-p],[p,q]],[[x,y],[y,-x]]);
                Q.setRows(i,j,Q0.dot(Q.getRows(i,j)));
            }
        }
    }
    var R = Q.dot(A).dot(Q.transjugate()), n = A.length, E = numeric.T.identity(n);
    for(j=0;j<n;j++) {
        if(j>0) {
            for(k=j-1;k>=0;k--) {
                var Rk = R.get([k,k]), Rj = R.get([j,j]);
                if(numeric.neq(Rk.x,Rj.x) || numeric.neq(Rk.y,Rj.y)) {
                    x = R.getRow(k).getBlock([k],[j-1]);
                    y = E.getRow(j).getBlock([k],[j-1]);
                    E.set([j,k],(R.get([k,j]).neg().sub(x.dot(y))).div(Rk.sub(Rj)));
                } else {
                    E.setRow(j,E.getRow(k));
                    continue;
                }
            }
        }
    }
    for(j=0;j<n;j++) {
        x = E.getRow(j);
        E.setRow(j,x.div(x.norm2()));
    }
    E = E.transpose();
    E = Q.transjugate().dot(E);
    return { lambda:R.getDiag(), E:E };
};

// 5. Compressed Column Storage matrices
numeric.ccsSparse = function ccsSparse(A) {
    var m = A.length,n,foo, i,j, counts = [];
    for(i=m-1;i!==-1;--i) {
        foo = A[i];
        for(j in foo) {
            j = parseInt(j);
            while(j>=counts.length) counts[counts.length] = 0;
            if(foo[j]!==0) counts[j]++;
        }
    }
    var n = counts.length;
    var Ai = Array(n+1);
    Ai[0] = 0;
    for(i=0;i<n;++i) Ai[i+1] = Ai[i] + counts[i];
    var Aj = Array(Ai[n]), Av = Array(Ai[n]);
    for(i=m-1;i!==-1;--i) {
        foo = A[i];
        for(j in foo) {
            if(foo[j]!==0) {
                counts[j]--;
                Aj[Ai[j]+counts[j]] = i;
                Av[Ai[j]+counts[j]] = foo[j];
            }
        }
    }
    return [Ai,Aj,Av];
}
numeric.ccsFull = function ccsFull(A) {
    var Ai = A[0], Aj = A[1], Av = A[2], s = numeric.ccsDim(A), m = s[0], n = s[1], i,j,j0,j1,k;
    var B = numeric.rep([m,n],0);
    for(i=0;i<n;i++) {
        j0 = Ai[i];
        j1 = Ai[i+1];
        for(j=j0;j<j1;++j) { B[Aj[j]][i] = Av[j]; }
    }
    return B;
}
numeric.ccsTSolve = function ccsTSolve(A,b,x,bj,xj) {
    var Ai = A[0], Aj = A[1], Av = A[2],m = Ai.length-1, max = Math.max,n=0;
    if(typeof bj === "undefined") x = numeric.rep([m],0);
    if(typeof bj === "undefined") bj = numeric.linspace(0,x.length-1);
    if(typeof xj === "undefined") xj = [];
    function dfs(j) {
        var k;
        if(x[j] !== 0) return;
        x[j] = 1;
        for(k=Ai[j];k<Ai[j+1];++k) dfs(Aj[k]);
        xj[n] = j;
        ++n;
    }
    var i,j,j0,j1,k,l,l0,l1,a;
    for(i=bj.length-1;i!==-1;--i) { dfs(bj[i]); }
    xj.length = n;
    for(i=xj.length-1;i!==-1;--i) { x[xj[i]] = 0; }
    for(i=bj.length-1;i!==-1;--i) { j = bj[i]; x[j] = b[j]; }
    for(i=xj.length-1;i!==-1;--i) {
        j = xj[i];
        j0 = Ai[j];
        j1 = max(Ai[j+1],j0);
        for(k=j0;k!==j1;++k) { if(Aj[k] === j) { x[j] /= Av[k]; break; } }
        a = x[j];
        for(k=j0;k!==j1;++k) {
            l = Aj[k];
            if(l !== j) x[l] -= a*Av[k];
        }
    }
    return x;
}
numeric.ccsDFS = function ccsDFS(n) {
    this.k = Array(n);
    this.k1 = Array(n);
    this.j = Array(n);
}
numeric.ccsDFS.prototype.dfs = function dfs(J,Ai,Aj,x,xj,Pinv) {
    var m = 0,foo,n=xj.length;
    var k = this.k, k1 = this.k1, j = this.j,km,k11;
    if(x[J]!==0) return;
    x[J] = 1;
    j[0] = J;
    k[0] = km = Ai[J];
    k1[0] = k11 = Ai[J+1];
    while(1) {
        if(km >= k11) {
            xj[n] = j[m];
            if(m===0) return;
            ++n;
            --m;
            km = k[m];
            k11 = k1[m];
        } else {
            foo = Pinv[Aj[km]];
            if(x[foo] === 0) {
                x[foo] = 1;
                k[m] = km;
                ++m;
                j[m] = foo;
                km = Ai[foo];
                k1[m] = k11 = Ai[foo+1];
            } else ++km;
        }
    }
}
numeric.ccsLPSolve = function ccsLPSolve(A,B,x,xj,I,Pinv,dfs) {
    var Ai = A[0], Aj = A[1], Av = A[2],m = Ai.length-1, n=0;
    var Bi = B[0], Bj = B[1], Bv = B[2];
    
    var i,i0,i1,j,J,j0,j1,k,l,l0,l1,a;
    i0 = Bi[I];
    i1 = Bi[I+1];
    xj.length = 0;
    for(i=i0;i<i1;++i) { dfs.dfs(Pinv[Bj[i]],Ai,Aj,x,xj,Pinv); }
    for(i=xj.length-1;i!==-1;--i) { x[xj[i]] = 0; }
    for(i=i0;i!==i1;++i) { j = Pinv[Bj[i]]; x[j] = Bv[i]; }
    for(i=xj.length-1;i!==-1;--i) {
        j = xj[i];
        j0 = Ai[j];
        j1 = Ai[j+1];
        for(k=j0;k<j1;++k) { if(Pinv[Aj[k]] === j) { x[j] /= Av[k]; break; } }
        a = x[j];
        for(k=j0;k<j1;++k) {
            l = Pinv[Aj[k]];
            if(l !== j) x[l] -= a*Av[k];
        }
    }
    return x;
}
numeric.ccsLUP1 = function ccsLUP1(A,threshold) {
    var m = A[0].length-1;
    var L = [numeric.rep([m+1],0),[],[]], U = [numeric.rep([m+1], 0),[],[]];
    var Li = L[0], Lj = L[1], Lv = L[2], Ui = U[0], Uj = U[1], Uv = U[2];
    var x = numeric.rep([m],0), xj = numeric.rep([m],0);
    var i,j,k,j0,j1,a,e,c,d,K;
    var sol = numeric.ccsLPSolve, max = Math.max, abs = Math.abs;
    var P = numeric.linspace(0,m-1),Pinv = numeric.linspace(0,m-1);
    var dfs = new numeric.ccsDFS(m);
    if(typeof threshold === "undefined") { threshold = 1; }
    for(i=0;i<m;++i) {
        sol(L,A,x,xj,i,Pinv,dfs);
        a = -1;
        e = -1;
        for(j=xj.length-1;j!==-1;--j) {
            k = xj[j];
            if(k <= i) continue;
            c = abs(x[k]);
            if(c > a) { e = k; a = c; }
        }
        if(abs(x[i])<threshold*a) {
            j = P[i];
            a = P[e];
            P[i] = a; Pinv[a] = i;
            P[e] = j; Pinv[j] = e;
            a = x[i]; x[i] = x[e]; x[e] = a;
        }
        a = Li[i];
        e = Ui[i];
        d = x[i];
        Lj[a] = P[i];
        Lv[a] = 1;
        ++a;
        for(j=xj.length-1;j!==-1;--j) {
            k = xj[j];
            c = x[k];
            xj[j] = 0;
            x[k] = 0;
            if(k<=i) { Uj[e] = k; Uv[e] = c;   ++e; }
            else     { Lj[a] = P[k]; Lv[a] = c/d; ++a; }
        }
        Li[i+1] = a;
        Ui[i+1] = e;
    }
    for(j=Lj.length-1;j!==-1;--j) { Lj[j] = Pinv[Lj[j]]; }
    return {L:L, U:U, P:P, Pinv:Pinv};
}
numeric.ccsDFS0 = function ccsDFS0(n) {
    this.k = Array(n);
    this.k1 = Array(n);
    this.j = Array(n);
}
numeric.ccsDFS0.prototype.dfs = function dfs(J,Ai,Aj,x,xj,Pinv,P) {
    var m = 0,foo,n=xj.length;
    var k = this.k, k1 = this.k1, j = this.j,km,k11;
    if(x[J]!==0) return;
    x[J] = 1;
    j[0] = J;
    k[0] = km = Ai[Pinv[J]];
    k1[0] = k11 = Ai[Pinv[J]+1];
    while(1) {
        if(isNaN(km)) throw new Error("Ow!");
        if(km >= k11) {
            xj[n] = Pinv[j[m]];
            if(m===0) return;
            ++n;
            --m;
            km = k[m];
            k11 = k1[m];
        } else {
            foo = Aj[km];
            if(x[foo] === 0) {
                x[foo] = 1;
                k[m] = km;
                ++m;
                j[m] = foo;
                foo = Pinv[foo];
                km = Ai[foo];
                k1[m] = k11 = Ai[foo+1];
            } else ++km;
        }
    }
}
numeric.ccsLPSolve0 = function ccsLPSolve0(A,B,y,xj,I,Pinv,P,dfs) {
    var Ai = A[0], Aj = A[1], Av = A[2],m = Ai.length-1, n=0;
    var Bi = B[0], Bj = B[1], Bv = B[2];
    
    var i,i0,i1,j,J,j0,j1,k,l,l0,l1,a;
    i0 = Bi[I];
    i1 = Bi[I+1];
    xj.length = 0;
    for(i=i0;i<i1;++i) { dfs.dfs(Bj[i],Ai,Aj,y,xj,Pinv,P); }
    for(i=xj.length-1;i!==-1;--i) { j = xj[i]; y[P[j]] = 0; }
    for(i=i0;i!==i1;++i) { j = Bj[i]; y[j] = Bv[i]; }
    for(i=xj.length-1;i!==-1;--i) {
        j = xj[i];
        l = P[j];
        j0 = Ai[j];
        j1 = Ai[j+1];
        for(k=j0;k<j1;++k) { if(Aj[k] === l) { y[l] /= Av[k]; break; } }
        a = y[l];
        for(k=j0;k<j1;++k) y[Aj[k]] -= a*Av[k];
        y[l] = a;
    }
}
numeric.ccsLUP0 = function ccsLUP0(A,threshold) {
    var m = A[0].length-1;
    var L = [numeric.rep([m+1],0),[],[]], U = [numeric.rep([m+1], 0),[],[]];
    var Li = L[0], Lj = L[1], Lv = L[2], Ui = U[0], Uj = U[1], Uv = U[2];
    var y = numeric.rep([m],0), xj = numeric.rep([m],0);
    var i,j,k,j0,j1,a,e,c,d,K;
    var sol = numeric.ccsLPSolve0, max = Math.max, abs = Math.abs;
    var P = numeric.linspace(0,m-1),Pinv = numeric.linspace(0,m-1);
    var dfs = new numeric.ccsDFS0(m);
    if(typeof threshold === "undefined") { threshold = 1; }
    for(i=0;i<m;++i) {
        sol(L,A,y,xj,i,Pinv,P,dfs);
        a = -1;
        e = -1;
        for(j=xj.length-1;j!==-1;--j) {
            k = xj[j];
            if(k <= i) continue;
            c = abs(y[P[k]]);
            if(c > a) { e = k; a = c; }
        }
        if(abs(y[P[i]])<threshold*a) {
            j = P[i];
            a = P[e];
            P[i] = a; Pinv[a] = i;
            P[e] = j; Pinv[j] = e;
        }
        a = Li[i];
        e = Ui[i];
        d = y[P[i]];
        Lj[a] = P[i];
        Lv[a] = 1;
        ++a;
        for(j=xj.length-1;j!==-1;--j) {
            k = xj[j];
            c = y[P[k]];
            xj[j] = 0;
            y[P[k]] = 0;
            if(k<=i) { Uj[e] = k; Uv[e] = c;   ++e; }
            else     { Lj[a] = P[k]; Lv[a] = c/d; ++a; }
        }
        Li[i+1] = a;
        Ui[i+1] = e;
    }
    for(j=Lj.length-1;j!==-1;--j) { Lj[j] = Pinv[Lj[j]]; }
    return {L:L, U:U, P:P, Pinv:Pinv};
}
numeric.ccsLUP = numeric.ccsLUP0;

numeric.ccsDim = function ccsDim(A) { return [numeric.sup(A[1])+1,A[0].length-1]; }
numeric.ccsGetBlock = function ccsGetBlock(A,i,j) {
    var s = numeric.ccsDim(A),m=s[0],n=s[1];
    if(typeof i === "undefined") { i = numeric.linspace(0,m-1); }
    else if(typeof i === "number") { i = [i]; }
    if(typeof j === "undefined") { j = numeric.linspace(0,n-1); }
    else if(typeof j === "number") { j = [j]; }
    var p,p0,p1,P = i.length,q,Q = j.length,r,jq,ip;
    var Bi = numeric.rep([n],0), Bj=[], Bv=[], B = [Bi,Bj,Bv];
    var Ai = A[0], Aj = A[1], Av = A[2];
    var x = numeric.rep([m],0),count=0,flags = numeric.rep([m],0);
    for(q=0;q<Q;++q) {
        jq = j[q];
        var q0 = Ai[jq];
        var q1 = Ai[jq+1];
        for(p=q0;p<q1;++p) {
            r = Aj[p];
            flags[r] = 1;
            x[r] = Av[p];
        }
        for(p=0;p<P;++p) {
            ip = i[p];
            if(flags[ip]) {
                Bj[count] = p;
                Bv[count] = x[i[p]];
                ++count;
            }
        }
        for(p=q0;p<q1;++p) {
            r = Aj[p];
            flags[r] = 0;
        }
        Bi[q+1] = count;
    }
    return B;
}

numeric.ccsDot = function ccsDot(A,B) {
    var Ai = A[0], Aj = A[1], Av = A[2];
    var Bi = B[0], Bj = B[1], Bv = B[2];
    var sA = numeric.ccsDim(A), sB = numeric.ccsDim(B);
    var m = sA[0], n = sA[1], o = sB[1];
    var x = numeric.rep([m],0), flags = numeric.rep([m],0), xj = Array(m);
    var Ci = numeric.rep([o],0), Cj = [], Cv = [], C = [Ci,Cj,Cv];
    var i,j,k,j0,j1,i0,i1,l,p,a,b;
    for(k=0;k!==o;++k) {
        j0 = Bi[k];
        j1 = Bi[k+1];
        p = 0;
        for(j=j0;j<j1;++j) {
            a = Bj[j];
            b = Bv[j];
            i0 = Ai[a];
            i1 = Ai[a+1];
            for(i=i0;i<i1;++i) {
                l = Aj[i];
                if(flags[l]===0) {
                    xj[p] = l;
                    flags[l] = 1;
                    p = p+1;
                }
                x[l] = x[l] + Av[i]*b;
            }
        }
        j0 = Ci[k];
        j1 = j0+p;
        Ci[k+1] = j1;
        for(j=p-1;j!==-1;--j) {
            b = j0+j;
            i = xj[j];
            Cj[b] = i;
            Cv[b] = x[i];
            flags[i] = 0;
            x[i] = 0;
        }
        Ci[k+1] = Ci[k]+p;
    }
    return C;
}

numeric.ccsLUPSolve = function ccsLUPSolve(LUP,B) {
    var L = LUP.L, U = LUP.U, P = LUP.P;
    var Bi = B[0];
    var flag = false;
    if(typeof Bi !== "object") { B = [[0,B.length],numeric.linspace(0,B.length-1),B]; Bi = B[0]; flag = true; }
    var Bj = B[1], Bv = B[2];
    var n = L[0].length-1, m = Bi.length-1;
    var x = numeric.rep([n],0), xj = Array(n);
    var b = numeric.rep([n],0), bj = Array(n);
    var Xi = numeric.rep([m+1],0), Xj = [], Xv = [];
    var sol = numeric.ccsTSolve;
    var i,j,j0,j1,k,J,N=0;
    for(i=0;i<m;++i) {
        k = 0;
        j0 = Bi[i];
        j1 = Bi[i+1];
        for(j=j0;j<j1;++j) { 
            J = LUP.Pinv[Bj[j]];
            bj[k] = J;
            b[J] = Bv[j];
            ++k;
        }
        bj.length = k;
        sol(L,b,x,bj,xj);
        for(j=bj.length-1;j!==-1;--j) b[bj[j]] = 0;
        sol(U,x,b,xj,bj);
        if(flag) return b;
        for(j=xj.length-1;j!==-1;--j) x[xj[j]] = 0;
        for(j=bj.length-1;j!==-1;--j) {
            J = bj[j];
            Xj[N] = J;
            Xv[N] = b[J];
            b[J] = 0;
            ++N;
        }
        Xi[i+1] = N;
    }
    return [Xi,Xj,Xv];
}

numeric.ccsbinop = function ccsbinop(body,setup) {
    if(typeof setup === "undefined") setup='';
    return Function('X','Y',
            'var Xi = X[0], Xj = X[1], Xv = X[2];\n'+
            'var Yi = Y[0], Yj = Y[1], Yv = Y[2];\n'+
            'var n = Xi.length-1,m = Math.max(numeric.sup(Xj),numeric.sup(Yj))+1;\n'+
            'var Zi = numeric.rep([n+1],0), Zj = [], Zv = [];\n'+
            'var x = numeric.rep([m],0),y = numeric.rep([m],0);\n'+
            'var xk,yk,zk;\n'+
            'var i,j,j0,j1,k,p=0;\n'+
            setup+
            'for(i=0;i<n;++i) {\n'+
            '  j0 = Xi[i]; j1 = Xi[i+1];\n'+
            '  for(j=j0;j!==j1;++j) {\n'+
            '    k = Xj[j];\n'+
            '    x[k] = 1;\n'+
            '    Zj[p] = k;\n'+
            '    ++p;\n'+
            '  }\n'+
            '  j0 = Yi[i]; j1 = Yi[i+1];\n'+
            '  for(j=j0;j!==j1;++j) {\n'+
            '    k = Yj[j];\n'+
            '    y[k] = Yv[j];\n'+
            '    if(x[k] === 0) {\n'+
            '      Zj[p] = k;\n'+
            '      ++p;\n'+
            '    }\n'+
            '  }\n'+
            '  Zi[i+1] = p;\n'+
            '  j0 = Xi[i]; j1 = Xi[i+1];\n'+
            '  for(j=j0;j!==j1;++j) x[Xj[j]] = Xv[j];\n'+
            '  j0 = Zi[i]; j1 = Zi[i+1];\n'+
            '  for(j=j0;j!==j1;++j) {\n'+
            '    k = Zj[j];\n'+
            '    xk = x[k];\n'+
            '    yk = y[k];\n'+
            body+'\n'+
            '    Zv[j] = zk;\n'+
            '  }\n'+
            '  j0 = Xi[i]; j1 = Xi[i+1];\n'+
            '  for(j=j0;j!==j1;++j) x[Xj[j]] = 0;\n'+
            '  j0 = Yi[i]; j1 = Yi[i+1];\n'+
            '  for(j=j0;j!==j1;++j) y[Yj[j]] = 0;\n'+
            '}\n'+
            'return [Zi,Zj,Zv];'
            );
};

(function() {
    var k,A,B,C;
    for(k in numeric.ops2) {
        if(isFinite(eval('1'+numeric.ops2[k]+'0'))) A = '[Y[0],Y[1],numeric.'+k+'(X,Y[2])]';
        else A = 'NaN';
        if(isFinite(eval('0'+numeric.ops2[k]+'1'))) B = '[X[0],X[1],numeric.'+k+'(X[2],Y)]';
        else B = 'NaN';
        if(isFinite(eval('1'+numeric.ops2[k]+'0')) && isFinite(eval('0'+numeric.ops2[k]+'1'))) C = 'numeric.ccs'+k+'MM(X,Y)';
        else C = 'NaN';
        numeric['ccs'+k+'MM'] = numeric.ccsbinop('zk = xk '+numeric.ops2[k]+'yk;');
        numeric['ccs'+k] = Function('X','Y',
                'if(typeof X === "number") return '+A+';\n'+
                'if(typeof Y === "number") return '+B+';\n'+
                'return '+C+';\n'
                );
    }
}());

numeric.ccsScatter = function ccsScatter(A) {
    var Ai = A[0], Aj = A[1], Av = A[2];
    var n = numeric.sup(Aj)+1,m=Ai.length;
    var Ri = numeric.rep([n],0),Rj=Array(m), Rv = Array(m);
    var counts = numeric.rep([n],0),i;
    for(i=0;i<m;++i) counts[Aj[i]]++;
    for(i=0;i<n;++i) Ri[i+1] = Ri[i] + counts[i];
    var ptr = Ri.slice(0),k,Aii;
    for(i=0;i<m;++i) {
        Aii = Aj[i];
        k = ptr[Aii];
        Rj[k] = Ai[i];
        Rv[k] = Av[i];
        ptr[Aii]=ptr[Aii]+1;
    }
    return [Ri,Rj,Rv];
}

numeric.ccsGather = function ccsGather(A) {
    var Ai = A[0], Aj = A[1], Av = A[2];
    var n = Ai.length-1,m = Aj.length;
    var Ri = Array(m), Rj = Array(m), Rv = Array(m);
    var i,j,j0,j1,p;
    p=0;
    for(i=0;i<n;++i) {
        j0 = Ai[i];
        j1 = Ai[i+1];
        for(j=j0;j!==j1;++j) {
            Rj[p] = i;
            Ri[p] = Aj[j];
            Rv[p] = Av[j];
            ++p;
        }
    }
    return [Ri,Rj,Rv];
}

// The following sparse linear algebra routines are deprecated.

numeric.sdim = function dim(A,ret,k) {
    if(typeof ret === "undefined") { ret = []; }
    if(typeof A !== "object") return ret;
    if(typeof k === "undefined") { k=0; }
    if(!(k in ret)) { ret[k] = 0; }
    if(A.length > ret[k]) ret[k] = A.length;
    var i;
    for(i in A) {
        if(A.hasOwnProperty(i)) dim(A[i],ret,k+1);
    }
    return ret;
};

numeric.sclone = function clone(A,k,n) {
    if(typeof k === "undefined") { k=0; }
    if(typeof n === "undefined") { n = numeric.sdim(A).length; }
    var i,ret = Array(A.length);
    if(k === n-1) {
        for(i in A) { if(A.hasOwnProperty(i)) ret[i] = A[i]; }
        return ret;
    }
    for(i in A) {
        if(A.hasOwnProperty(i)) ret[i] = clone(A[i],k+1,n);
    }
    return ret;
}

numeric.sdiag = function diag(d) {
    var n = d.length,i,ret = Array(n),i1,i2,i3;
    for(i=n-1;i>=1;i-=2) {
        i1 = i-1;
        ret[i] = []; ret[i][i] = d[i];
        ret[i1] = []; ret[i1][i1] = d[i1];
    }
    if(i===0) { ret[0] = []; ret[0][0] = d[i]; }
    return ret;
}

numeric.sidentity = function identity(n) { return numeric.sdiag(numeric.rep([n],1)); }

numeric.stranspose = function transpose(A) {
    var ret = [], n = A.length, i,j,Ai;
    for(i in A) {
        if(!(A.hasOwnProperty(i))) continue;
        Ai = A[i];
        for(j in Ai) {
            if(!(Ai.hasOwnProperty(j))) continue;
            if(typeof ret[j] !== "object") { ret[j] = []; }
            ret[j][i] = Ai[j];
        }
    }
    return ret;
}

numeric.sLUP = function LUP(A,tol) {
    throw new Error("The function numeric.sLUP had a bug in it and has been removed. Please use the new numeric.ccsLUP function instead.");
};

numeric.sdotMM = function dotMM(A,B) {
    var p = A.length, q = B.length, BT = numeric.stranspose(B), r = BT.length, Ai, BTk;
    var i,j,k,accum;
    var ret = Array(p),reti;
    for(i=p-1;i>=0;i--) {
        reti = [];
        Ai = A[i];
        for(k=r-1;k>=0;k--) {
            accum = 0;
            BTk = BT[k];
            for(j in Ai) {
                if(!(Ai.hasOwnProperty(j))) continue;
                if(j in BTk) { accum += Ai[j]*BTk[j]; }
            }
            if(accum) reti[k] = accum;
        }
        ret[i] = reti;
    }
    return ret;
}

numeric.sdotMV = function dotMV(A,x) {
    var p = A.length, Ai, i,j;
    var ret = Array(p), accum;
    for(i=p-1;i>=0;i--) {
        Ai = A[i];
        accum = 0;
        for(j in Ai) {
            if(!(Ai.hasOwnProperty(j))) continue;
            if(x[j]) accum += Ai[j]*x[j];
        }
        if(accum) ret[i] = accum;
    }
    return ret;
}

numeric.sdotVM = function dotMV(x,A) {
    var i,j,Ai,alpha;
    var ret = [], accum;
    for(i in x) {
        if(!x.hasOwnProperty(i)) continue;
        Ai = A[i];
        alpha = x[i];
        for(j in Ai) {
            if(!Ai.hasOwnProperty(j)) continue;
            if(!ret[j]) { ret[j] = 0; }
            ret[j] += alpha*Ai[j];
        }
    }
    return ret;
}

numeric.sdotVV = function dotVV(x,y) {
    var i,ret=0;
    for(i in x) { if(x[i] && y[i]) ret+= x[i]*y[i]; }
    return ret;
}

numeric.sdot = function dot(A,B) {
    var m = numeric.sdim(A).length, n = numeric.sdim(B).length;
    var k = m*1000+n;
    switch(k) {
    case 0: return A*B;
    case 1001: return numeric.sdotVV(A,B);
    case 2001: return numeric.sdotMV(A,B);
    case 1002: return numeric.sdotVM(A,B);
    case 2002: return numeric.sdotMM(A,B);
    default: throw new Error('numeric.sdot not implemented for tensors of order '+m+' and '+n);
    }
}

numeric.sscatter = function scatter(V) {
    var n = V[0].length, Vij, i, j, m = V.length, A = [], Aj;
    for(i=n-1;i>=0;--i) {
        if(!V[m-1][i]) continue;
        Aj = A;
        for(j=0;j<m-2;j++) {
            Vij = V[j][i];
            if(!Aj[Vij]) Aj[Vij] = [];
            Aj = Aj[Vij];
        }
        Aj[V[j][i]] = V[j+1][i];
    }
    return A;
}

numeric.sgather = function gather(A,ret,k) {
    if(typeof ret === "undefined") ret = [];
    if(typeof k === "undefined") k = [];
    var n,i,Ai;
    n = k.length;
    for(i in A) {
        if(A.hasOwnProperty(i)) {
            k[n] = parseInt(i);
            Ai = A[i];
            if(typeof Ai === "number") {
                if(Ai) {
                    if(ret.length === 0) {
                        for(i=n+1;i>=0;--i) ret[i] = [];
                    }
                    for(i=n;i>=0;--i) ret[i].push(k[i]);
                    ret[n+1].push(Ai);
                }
            } else gather(Ai,ret,k);
        }
    }
    if(k.length>n) k.pop();
    return ret;
}

// 6. Coordinate matrices
numeric.cLU = function LU(A) {
    var I = A[0], J = A[1], V = A[2];
    var p = I.length, m=0, i,j,k,a,b,c;
    for(i=0;i<p;i++) if(I[i]>m) m=I[i];
    m++;
    var L = Array(m), U = Array(m), left = numeric.rep([m],Infinity), right = numeric.rep([m],-Infinity);
    var Ui, Uj,alpha;
    for(k=0;k<p;k++) {
        i = I[k];
        j = J[k];
        if(j<left[i]) left[i] = j;
        if(j>right[i]) right[i] = j;
    }
    for(i=0;i<m-1;i++) { if(right[i] > right[i+1]) right[i+1] = right[i]; }
    for(i=m-1;i>=1;i--) { if(left[i]<left[i-1]) left[i-1] = left[i]; }
    var countL = 0, countU = 0;
    for(i=0;i<m;i++) {
        U[i] = numeric.rep([right[i]-left[i]+1],0);
        L[i] = numeric.rep([i-left[i]],0);
        countL += i-left[i]+1;
        countU += right[i]-i+1;
    }
    for(k=0;k<p;k++) { i = I[k]; U[i][J[k]-left[i]] = V[k]; }
    for(i=0;i<m-1;i++) {
        a = i-left[i];
        Ui = U[i];
        for(j=i+1;left[j]<=i && j<m;j++) {
            b = i-left[j];
            c = right[i]-i;
            Uj = U[j];
            alpha = Uj[b]/Ui[a];
            if(alpha) {
                for(k=1;k<=c;k++) { Uj[k+b] -= alpha*Ui[k+a]; }
                L[j][i-left[j]] = alpha;
            }
        }
    }
    var Ui = [], Uj = [], Uv = [], Li = [], Lj = [], Lv = [];
    var p,q,foo;
    p=0; q=0;
    for(i=0;i<m;i++) {
        a = left[i];
        b = right[i];
        foo = U[i];
        for(j=i;j<=b;j++) {
            if(foo[j-a]) {
                Ui[p] = i;
                Uj[p] = j;
                Uv[p] = foo[j-a];
                p++;
            }
        }
        foo = L[i];
        for(j=a;j<i;j++) {
            if(foo[j-a]) {
                Li[q] = i;
                Lj[q] = j;
                Lv[q] = foo[j-a];
                q++;
            }
        }
        Li[q] = i;
        Lj[q] = i;
        Lv[q] = 1;
        q++;
    }
    return {U:[Ui,Uj,Uv], L:[Li,Lj,Lv]};
};

numeric.cLUsolve = function LUsolve(lu,b) {
    var L = lu.L, U = lu.U, ret = numeric.clone(b);
    var Li = L[0], Lj = L[1], Lv = L[2];
    var Ui = U[0], Uj = U[1], Uv = U[2];
    var p = Ui.length, q = Li.length;
    var m = ret.length,i,j,k;
    k = 0;
    for(i=0;i<m;i++) {
        while(Lj[k] < i) {
            ret[i] -= Lv[k]*ret[Lj[k]];
            k++;
        }
        k++;
    }
    k = p-1;
    for(i=m-1;i>=0;i--) {
        while(Uj[k] > i) {
            ret[i] -= Uv[k]*ret[Uj[k]];
            k--;
        }
        ret[i] /= Uv[k];
        k--;
    }
    return ret;
};

numeric.cgrid = function grid(n,shape) {
    if(typeof n === "number") n = [n,n];
    var ret = numeric.rep(n,-1);
    var i,j,count;
    if(typeof shape !== "function") {
        switch(shape) {
        case 'L':
            shape = function(i,j) { return (i>=n[0]/2 || j<n[1]/2); }
            break;
        default:
            shape = function(i,j) { return true; };
            break;
        }
    }
    count=0;
    for(i=1;i<n[0]-1;i++) for(j=1;j<n[1]-1;j++) 
        if(shape(i,j)) {
            ret[i][j] = count;
            count++;
        }
    return ret;
}

numeric.cdelsq = function delsq(g) {
    var dir = [[-1,0],[0,-1],[0,1],[1,0]];
    var s = numeric.dim(g), m = s[0], n = s[1], i,j,k,p,q;
    var Li = [], Lj = [], Lv = [];
    for(i=1;i<m-1;i++) for(j=1;j<n-1;j++) {
        if(g[i][j]<0) continue;
        for(k=0;k<4;k++) {
            p = i+dir[k][0];
            q = j+dir[k][1];
            if(g[p][q]<0) continue;
            Li.push(g[i][j]);
            Lj.push(g[p][q]);
            Lv.push(-1);
        }
        Li.push(g[i][j]);
        Lj.push(g[i][j]);
        Lv.push(4);
    }
    return [Li,Lj,Lv];
}

numeric.cdotMV = function dotMV(A,x) {
    var ret, Ai = A[0], Aj = A[1], Av = A[2],k,p=Ai.length,N;
    N=0;
    for(k=0;k<p;k++) { if(Ai[k]>N) N = Ai[k]; }
    N++;
    ret = numeric.rep([N],0);
    for(k=0;k<p;k++) { ret[Ai[k]]+=Av[k]*x[Aj[k]]; }
    return ret;
}

// 7. Splines

numeric.Spline = function Spline(x,yl,yr,kl,kr) { this.x = x; this.yl = yl; this.yr = yr; this.kl = kl; this.kr = kr; }
numeric.Spline.prototype._at = function _at(x1,p) {
    var x = this.x;
    var yl = this.yl;
    var yr = this.yr;
    var kl = this.kl;
    var kr = this.kr;
    var x1,a,b,t;
    var add = numeric.add, sub = numeric.sub, mul = numeric.mul;
    a = sub(mul(kl[p],x[p+1]-x[p]),sub(yr[p+1],yl[p]));
    b = add(mul(kr[p+1],x[p]-x[p+1]),sub(yr[p+1],yl[p]));
    t = (x1-x[p])/(x[p+1]-x[p]);
    var s = t*(1-t);
    return add(add(add(mul(1-t,yl[p]),mul(t,yr[p+1])),mul(a,s*(1-t))),mul(b,s*t));
}
numeric.Spline.prototype.at = function at(x0) {
    if(typeof x0 === "number") {
        var x = this.x;
        var n = x.length;
        var p,q,mid,floor = Math.floor,a,b,t;
        p = 0;
        q = n-1;
        while(q-p>1) {
            mid = floor((p+q)/2);
            if(x[mid] <= x0) p = mid;
            else q = mid;
        }
        return this._at(x0,p);
    }
    var n = x0.length, i, ret = Array(n);
    for(i=n-1;i!==-1;--i) ret[i] = this.at(x0[i]);
    return ret;
}
numeric.Spline.prototype.diff = function diff() {
    var x = this.x;
    var yl = this.yl;
    var yr = this.yr;
    var kl = this.kl;
    var kr = this.kr;
    var n = yl.length;
    var i,dx,dy;
    var zl = kl, zr = kr, pl = Array(n), pr = Array(n);
    var add = numeric.add, mul = numeric.mul, div = numeric.div, sub = numeric.sub;
    for(i=n-1;i!==-1;--i) {
        dx = x[i+1]-x[i];
        dy = sub(yr[i+1],yl[i]);
        pl[i] = div(add(mul(dy, 6),mul(kl[i],-4*dx),mul(kr[i+1],-2*dx)),dx*dx);
        pr[i+1] = div(add(mul(dy,-6),mul(kl[i], 2*dx),mul(kr[i+1], 4*dx)),dx*dx);
    }
    return new numeric.Spline(x,zl,zr,pl,pr);
}
numeric.Spline.prototype.roots = function roots() {
    function sqr(x) { return x*x; }
    function heval(y0,y1,k0,k1,x) {
        var A = k0*2-(y1-y0);
        var B = -k1*2+(y1-y0);
        var t = (x+1)*0.5;
        var s = t*(1-t);
        return (1-t)*y0+t*y1+A*s*(1-t)+B*s*t;
    }
    var ret = [];
    var x = this.x, yl = this.yl, yr = this.yr, kl = this.kl, kr = this.kr;
    if(typeof yl[0] === "number") {
        yl = [yl];
        yr = [yr];
        kl = [kl];
        kr = [kr];
    }
    var m = yl.length,n=x.length-1,i,j,k,y,s,t;
    var ai,bi,ci,di, ret = Array(m),ri,k0,k1,y0,y1,A,B,D,dx,cx,stops,z0,z1,zm,t0,t1,tm;
    var sqrt = Math.sqrt;
    for(i=0;i!==m;++i) {
        ai = yl[i];
        bi = yr[i];
        ci = kl[i];
        di = kr[i];
        ri = [];
        for(j=0;j!==n;j++) {
            if(j>0 && bi[j]*ai[j]<0) ri.push(x[j]);
            dx = (x[j+1]-x[j]);
            cx = x[j];
            y0 = ai[j];
            y1 = bi[j+1];
            k0 = ci[j]/dx;
            k1 = di[j+1]/dx;
            D = sqr(k0-k1+3*(y0-y1)) + 12*k1*y0;
            A = k1+3*y0+2*k0-3*y1;
            B = 3*(k1+k0+2*(y0-y1));
            if(D<=0) {
                z0 = A/B;
                if(z0>x[j] && z0<x[j+1]) stops = [x[j],z0,x[j+1]];
                else stops = [x[j],x[j+1]];
            } else {
                z0 = (A-sqrt(D))/B;
                z1 = (A+sqrt(D))/B;
                stops = [x[j]];
                if(z0>x[j] && z0<x[j+1]) stops.push(z0);
                if(z1>x[j] && z1<x[j+1]) stops.push(z1);
                stops.push(x[j+1]);
            }
            t0 = stops[0];
            z0 = this._at(t0,j);
            for(k=0;k<stops.length-1;k++) {
                t1 = stops[k+1];
                z1 = this._at(t1,j);
                if(z0 === 0) {
                    ri.push(t0); 
                    t0 = t1;
                    z0 = z1;
                    continue;
                }
                if(z1 === 0 || z0*z1>0) {
                    t0 = t1;
                    z0 = z1;
                    continue;
                }
                var side = 0;
                while(1) {
                    tm = (z0*t1-z1*t0)/(z0-z1);
                    if(tm <= t0 || tm >= t1) { break; }
                    zm = this._at(tm,j);
                    if(zm*z1>0) {
                        t1 = tm;
                        z1 = zm;
                        if(side === -1) z0*=0.5;
                        side = -1;
                    } else if(zm*z0>0) {
                        t0 = tm;
                        z0 = zm;
                        if(side === 1) z1*=0.5;
                        side = 1;
                    } else break;
                }
                ri.push(tm);
                t0 = stops[k+1];
                z0 = this._at(t0, j);
            }
            if(z1 === 0) ri.push(t1);
        }
        ret[i] = ri;
    }
    if(typeof this.yl[0] === "number") return ret[0];
    return ret;
}
numeric.spline = function spline(x,y,k1,kn) {
    var n = x.length, b = [], dx = [], dy = [];
    var i;
    var sub = numeric.sub,mul = numeric.mul,add = numeric.add;
    for(i=n-2;i>=0;i--) { dx[i] = x[i+1]-x[i]; dy[i] = sub(y[i+1],y[i]); }
    if(typeof k1 === "string" || typeof kn === "string") { 
        k1 = kn = "periodic";
    }
    // Build sparse tridiagonal system
    var T = [[],[],[]];
    switch(typeof k1) {
    case "undefined":
        b[0] = mul(3/(dx[0]*dx[0]),dy[0]);
        T[0].push(0,0);
        T[1].push(0,1);
        T[2].push(2/dx[0],1/dx[0]);
        break;
    case "string":
        b[0] = add(mul(3/(dx[n-2]*dx[n-2]),dy[n-2]),mul(3/(dx[0]*dx[0]),dy[0]));
        T[0].push(0,0,0);
        T[1].push(n-2,0,1);
        T[2].push(1/dx[n-2],2/dx[n-2]+2/dx[0],1/dx[0]);
        break;
    default:
        b[0] = k1;
        T[0].push(0);
        T[1].push(0);
        T[2].push(1);
        break;
    }
    for(i=1;i<n-1;i++) {
        b[i] = add(mul(3/(dx[i-1]*dx[i-1]),dy[i-1]),mul(3/(dx[i]*dx[i]),dy[i]));
        T[0].push(i,i,i);
        T[1].push(i-1,i,i+1);
        T[2].push(1/dx[i-1],2/dx[i-1]+2/dx[i],1/dx[i]);
    }
    switch(typeof kn) {
    case "undefined":
        b[n-1] = mul(3/(dx[n-2]*dx[n-2]),dy[n-2]);
        T[0].push(n-1,n-1);
        T[1].push(n-2,n-1);
        T[2].push(1/dx[n-2],2/dx[n-2]);
        break;
    case "string":
        T[1][T[1].length-1] = 0;
        break;
    default:
        b[n-1] = kn;
        T[0].push(n-1);
        T[1].push(n-1);
        T[2].push(1);
        break;
    }
    if(typeof b[0] !== "number") b = numeric.transpose(b);
    else b = [b];
    var k = Array(b.length);
    if(typeof k1 === "string") {
        for(i=k.length-1;i!==-1;--i) {
            k[i] = numeric.ccsLUPSolve(numeric.ccsLUP(numeric.ccsScatter(T)),b[i]);
            k[i][n-1] = k[i][0];
        }
    } else {
        for(i=k.length-1;i!==-1;--i) {
            k[i] = numeric.cLUsolve(numeric.cLU(T),b[i]);
        }
    }
    if(typeof y[0] === "number") k = k[0];
    else k = numeric.transpose(k);
    return new numeric.Spline(x,y,y,k,k);
}

// 8. FFT
numeric.fftpow2 = function fftpow2(x,y) {
    var n = x.length;
    if(n === 1) return;
    var cos = Math.cos, sin = Math.sin, i,j;
    var xe = Array(n/2), ye = Array(n/2), xo = Array(n/2), yo = Array(n/2);
    j = n/2;
    for(i=n-1;i!==-1;--i) {
        --j;
        xo[j] = x[i];
        yo[j] = y[i];
        --i;
        xe[j] = x[i];
        ye[j] = y[i];
    }
    fftpow2(xe,ye);
    fftpow2(xo,yo);
    j = n/2;
    var t,k = (-6.2831853071795864769252867665590057683943387987502116419/n),ci,si;
    for(i=n-1;i!==-1;--i) {
        --j;
        if(j === -1) j = n/2-1;
        t = k*i;
        ci = cos(t);
        si = sin(t);
        x[i] = xe[j] + ci*xo[j] - si*yo[j];
        y[i] = ye[j] + ci*yo[j] + si*xo[j];
    }
}
numeric._ifftpow2 = function _ifftpow2(x,y) {
    var n = x.length;
    if(n === 1) return;
    var cos = Math.cos, sin = Math.sin, i,j;
    var xe = Array(n/2), ye = Array(n/2), xo = Array(n/2), yo = Array(n/2);
    j = n/2;
    for(i=n-1;i!==-1;--i) {
        --j;
        xo[j] = x[i];
        yo[j] = y[i];
        --i;
        xe[j] = x[i];
        ye[j] = y[i];
    }
    _ifftpow2(xe,ye);
    _ifftpow2(xo,yo);
    j = n/2;
    var t,k = (6.2831853071795864769252867665590057683943387987502116419/n),ci,si;
    for(i=n-1;i!==-1;--i) {
        --j;
        if(j === -1) j = n/2-1;
        t = k*i;
        ci = cos(t);
        si = sin(t);
        x[i] = xe[j] + ci*xo[j] - si*yo[j];
        y[i] = ye[j] + ci*yo[j] + si*xo[j];
    }
}
numeric.ifftpow2 = function ifftpow2(x,y) {
    numeric._ifftpow2(x,y);
    numeric.diveq(x,x.length);
    numeric.diveq(y,y.length);
}
numeric.convpow2 = function convpow2(ax,ay,bx,by) {
    numeric.fftpow2(ax,ay);
    numeric.fftpow2(bx,by);
    var i,n = ax.length,axi,bxi,ayi,byi;
    for(i=n-1;i!==-1;--i) {
        axi = ax[i]; ayi = ay[i]; bxi = bx[i]; byi = by[i];
        ax[i] = axi*bxi-ayi*byi;
        ay[i] = axi*byi+ayi*bxi;
    }
    numeric.ifftpow2(ax,ay);
}
numeric.T.prototype.fft = function fft() {
    var x = this.x, y = this.y;
    var n = x.length, log = Math.log, log2 = log(2),
        p = Math.ceil(log(2*n-1)/log2), m = Math.pow(2,p);
    var cx = numeric.rep([m],0), cy = numeric.rep([m],0), cos = Math.cos, sin = Math.sin;
    var k, c = (-3.141592653589793238462643383279502884197169399375105820/n),t;
    var a = numeric.rep([m],0), b = numeric.rep([m],0),nhalf = Math.floor(n/2);
    for(k=0;k<n;k++) a[k] = x[k];
    if(typeof y !== "undefined") for(k=0;k<n;k++) b[k] = y[k];
    cx[0] = 1;
    for(k=1;k<=m/2;k++) {
        t = c*k*k;
        cx[k] = cos(t);
        cy[k] = sin(t);
        cx[m-k] = cos(t);
        cy[m-k] = sin(t)
    }
    var X = new numeric.T(a,b), Y = new numeric.T(cx,cy);
    X = X.mul(Y);
    numeric.convpow2(X.x,X.y,numeric.clone(Y.x),numeric.neg(Y.y));
    X = X.mul(Y);
    X.x.length = n;
    X.y.length = n;
    return X;
}
numeric.T.prototype.ifft = function ifft() {
    var x = this.x, y = this.y;
    var n = x.length, log = Math.log, log2 = log(2),
        p = Math.ceil(log(2*n-1)/log2), m = Math.pow(2,p);
    var cx = numeric.rep([m],0), cy = numeric.rep([m],0), cos = Math.cos, sin = Math.sin;
    var k, c = (3.141592653589793238462643383279502884197169399375105820/n),t;
    var a = numeric.rep([m],0), b = numeric.rep([m],0),nhalf = Math.floor(n/2);
    for(k=0;k<n;k++) a[k] = x[k];
    if(typeof y !== "undefined") for(k=0;k<n;k++) b[k] = y[k];
    cx[0] = 1;
    for(k=1;k<=m/2;k++) {
        t = c*k*k;
        cx[k] = cos(t);
        cy[k] = sin(t);
        cx[m-k] = cos(t);
        cy[m-k] = sin(t)
    }
    var X = new numeric.T(a,b), Y = new numeric.T(cx,cy);
    X = X.mul(Y);
    numeric.convpow2(X.x,X.y,numeric.clone(Y.x),numeric.neg(Y.y));
    X = X.mul(Y);
    X.x.length = n;
    X.y.length = n;
    return X.div(n);
}

//9. Unconstrained optimization
numeric.gradient = function gradient(f,x) {
    var n = x.length;
    var f0 = f(x);
    if(isNaN(f0)) throw new Error('gradient: f(x) is a NaN!');
    var max = Math.max;
    var i,x0 = numeric.clone(x),f1,f2, J = Array(n);
    var div = numeric.div, sub = numeric.sub,errest,roundoff,max = Math.max,eps = 1e-3,abs = Math.abs, min = Math.min;
    var t0,t1,t2,it=0,d1,d2,N;
    for(i=0;i<n;i++) {
        var h = max(1e-6*f0,1e-8);
        while(1) {
            ++it;
            if(it>20) { throw new Error("Numerical gradient fails"); }
            x0[i] = x[i]+h;
            f1 = f(x0);
            x0[i] = x[i]-h;
            f2 = f(x0);
            x0[i] = x[i];
            if(isNaN(f1) || isNaN(f2)) { h/=16; continue; }
            J[i] = (f1-f2)/(2*h);
            t0 = x[i]-h;
            t1 = x[i];
            t2 = x[i]+h;
            d1 = (f1-f0)/h;
            d2 = (f0-f2)/h;
            N = max(abs(J[i]),abs(f0),abs(f1),abs(f2),abs(t0),abs(t1),abs(t2),1e-8);
            errest = min(max(abs(d1-J[i]),abs(d2-J[i]),abs(d1-d2))/N,h/N);
            if(errest>eps) { h/=16; }
            else break;
            }
    }
    return J;
}

numeric.uncmin = function uncmin(f,x0,tol,gradient,maxit,callback,options) {
    var grad = numeric.gradient;
    if(typeof options === "undefined") { options = {}; }
    if(typeof tol === "undefined") { tol = 1e-8; }
    if(typeof gradient === "undefined") { gradient = function(x) { return grad(f,x); }; }
    if(typeof maxit === "undefined") maxit = 1000;
    x0 = numeric.clone(x0);
    var n = x0.length;
    var f0 = f(x0),f1,df0;
    if(isNaN(f0)) throw new Error('uncmin: f(x0) is a NaN!');
    var max = Math.max, norm2 = numeric.norm2;
    tol = max(tol,numeric.epsilon);
    var step,g0,g1,H1 = options.Hinv || numeric.identity(n);
    var dot = numeric.dot, inv = numeric.inv, sub = numeric.sub, add = numeric.add, ten = numeric.tensor, div = numeric.div, mul = numeric.mul;
    var all = numeric.all, isfinite = numeric.isFinite, neg = numeric.neg;
    var it=0,i,s,x1,y,Hy,Hs,ys,i0,t,nstep,t1,t2;
    var msg = "";
    g0 = gradient(x0);
    while(it<maxit) {
        if(typeof callback === "function") { if(callback(it,x0,f0,g0,H1)) { msg = "Callback returned true"; break; } }
        if(!all(isfinite(g0))) { msg = "Gradient has Infinity or NaN"; break; }
        step = neg(dot(H1,g0));
        if(!all(isfinite(step))) { msg = "Search direction has Infinity or NaN"; break; }
        nstep = norm2(step);
        if(nstep < tol) { msg="Newton step smaller than tol"; break; }
        t = 1;
        df0 = dot(g0,step);
        // line search
        x1 = x0;
        while(it < maxit) {
            if(t*nstep < tol) { break; }
            s = mul(step,t);
            x1 = add(x0,s);
            f1 = f(x1);
            if(f1-f0 >= 0.1*t*df0 || isNaN(f1)) {
                t *= 0.5;
                ++it;
                continue;
            }
            break;
        }
        if(t*nstep < tol) { msg = "Line search step size smaller than tol"; break; }
        if(it === maxit) { msg = "maxit reached during line search"; break; }
        g1 = gradient(x1);
        y = sub(g1,g0);
        ys = dot(y,s);
        Hy = dot(H1,y);
        H1 = sub(add(H1,
                mul(
                        (ys+dot(y,Hy))/(ys*ys),
                        ten(s,s)    )),
                div(add(ten(Hy,s),ten(s,Hy)),ys));
        x0 = x1;
        f0 = f1;
        g0 = g1;
        ++it;
    }
    return {solution: x0, f: f0, gradient: g0, invHessian: H1, iterations:it, message: msg};
}

// 10. Ode solver (Dormand-Prince)
numeric.Dopri = function Dopri(x,y,f,ymid,iterations,msg,events) {
    this.x = x;
    this.y = y;
    this.f = f;
    this.ymid = ymid;
    this.iterations = iterations;
    this.events = events;
    this.message = msg;
}
numeric.Dopri.prototype._at = function _at(xi,j) {
    function sqr(x) { return x*x; }
    var sol = this;
    var xs = sol.x;
    var ys = sol.y;
    var k1 = sol.f;
    var ymid = sol.ymid;
    var n = xs.length;
    var x0,x1,xh,y0,y1,yh,xi;
    var floor = Math.floor,h;
    var c = 0.5;
    var add = numeric.add, mul = numeric.mul,sub = numeric.sub, p,q,w;
    x0 = xs[j];
    x1 = xs[j+1];
    y0 = ys[j];
    y1 = ys[j+1];
    h  = x1-x0;
    xh = x0+c*h;
    yh = ymid[j];
    p = sub(k1[j  ],mul(y0,1/(x0-xh)+2/(x0-x1)));
    q = sub(k1[j+1],mul(y1,1/(x1-xh)+2/(x1-x0)));
    w = [sqr(xi - x1) * (xi - xh) / sqr(x0 - x1) / (x0 - xh),
         sqr(xi - x0) * sqr(xi - x1) / sqr(x0 - xh) / sqr(x1 - xh),
         sqr(xi - x0) * (xi - xh) / sqr(x1 - x0) / (x1 - xh),
         (xi - x0) * sqr(xi - x1) * (xi - xh) / sqr(x0-x1) / (x0 - xh),
         (xi - x1) * sqr(xi - x0) * (xi - xh) / sqr(x0-x1) / (x1 - xh)];
    return add(add(add(add(mul(y0,w[0]),
                           mul(yh,w[1])),
                           mul(y1,w[2])),
                           mul( p,w[3])),
                           mul( q,w[4]));
}
numeric.Dopri.prototype.at = function at(x) {
    var i,j,k,floor = Math.floor;
    if(typeof x !== "number") {
        var n = x.length, ret = Array(n);
        for(i=n-1;i!==-1;--i) {
            ret[i] = this.at(x[i]);
        }
        return ret;
    }
    var x0 = this.x;
    i = 0; j = x0.length-1;
    while(j-i>1) {
        k = floor(0.5*(i+j));
        if(x0[k] <= x) i = k;
        else j = k;
    }
    return this._at(x,i);
}

numeric.dopri = function dopri(x0,x1,y0,f,tol,maxit,event) {
    if(typeof tol === "undefined") { tol = 1e-6; }
    if(typeof maxit === "undefined") { maxit = 1000; }
    var xs = [x0], ys = [y0], k1 = [f(x0,y0)], k2,k3,k4,k5,k6,k7, ymid = [];
    var A2 = 1/5;
    var A3 = [3/40,9/40];
    var A4 = [44/45,-56/15,32/9];
    var A5 = [19372/6561,-25360/2187,64448/6561,-212/729];
    var A6 = [9017/3168,-355/33,46732/5247,49/176,-5103/18656];
    var b = [35/384,0,500/1113,125/192,-2187/6784,11/84];
    var bm = [0.5*6025192743/30085553152,
              0,
              0.5*51252292925/65400821598,
              0.5*-2691868925/45128329728,
              0.5*187940372067/1594534317056,
              0.5*-1776094331/19743644256,
              0.5*11237099/235043384];
    var c = [1/5,3/10,4/5,8/9,1,1];
    var e = [-71/57600,0,71/16695,-71/1920,17253/339200,-22/525,1/40];
    var i = 0,er,j;
    var h = (x1-x0)/10;
    var it = 0;
    var add = numeric.add, mul = numeric.mul, y1,erinf;
    var max = Math.max, min = Math.min, abs = Math.abs, norminf = numeric.norminf,pow = Math.pow;
    var any = numeric.any, lt = numeric.lt, and = numeric.and, sub = numeric.sub;
    var e0, e1, ev;
    var ret = new numeric.Dopri(xs,ys,k1,ymid,-1,"");
    if(typeof event === "function") e0 = event(x0,y0);
    while(x0<x1 && it<maxit) {
        ++it;
        if(x0+h>x1) h = x1-x0;
        k2 = f(x0+c[0]*h,                add(y0,mul(   A2*h,k1[i])));
        k3 = f(x0+c[1]*h,            add(add(y0,mul(A3[0]*h,k1[i])),mul(A3[1]*h,k2)));
        k4 = f(x0+c[2]*h,        add(add(add(y0,mul(A4[0]*h,k1[i])),mul(A4[1]*h,k2)),mul(A4[2]*h,k3)));
        k5 = f(x0+c[3]*h,    add(add(add(add(y0,mul(A5[0]*h,k1[i])),mul(A5[1]*h,k2)),mul(A5[2]*h,k3)),mul(A5[3]*h,k4)));
        k6 = f(x0+c[4]*h,add(add(add(add(add(y0,mul(A6[0]*h,k1[i])),mul(A6[1]*h,k2)),mul(A6[2]*h,k3)),mul(A6[3]*h,k4)),mul(A6[4]*h,k5)));
        y1 = add(add(add(add(add(y0,mul(k1[i],h*b[0])),mul(k3,h*b[2])),mul(k4,h*b[3])),mul(k5,h*b[4])),mul(k6,h*b[5]));
        k7 = f(x0+h,y1);
        er = add(add(add(add(add(mul(k1[i],h*e[0]),mul(k3,h*e[2])),mul(k4,h*e[3])),mul(k5,h*e[4])),mul(k6,h*e[5])),mul(k7,h*e[6]));
        if(typeof er === "number") erinf = abs(er);
        else erinf = norminf(er);
        if(erinf > tol) { // reject
            h = 0.2*h*pow(tol/erinf,0.25);
            if(x0+h === x0) {
                ret.msg = "Step size became too small";
                break;
            }
            continue;
        }
        ymid[i] = add(add(add(add(add(add(y0,
                mul(k1[i],h*bm[0])),
                mul(k3   ,h*bm[2])),
                mul(k4   ,h*bm[3])),
                mul(k5   ,h*bm[4])),
                mul(k6   ,h*bm[5])),
                mul(k7   ,h*bm[6]));
        ++i;
        xs[i] = x0+h;
        ys[i] = y1;
        k1[i] = k7;
        if(typeof event === "function") {
            var yi,xl = x0,xr = x0+0.5*h,xi;
            e1 = event(xr,ymid[i-1]);
            ev = and(lt(e0,0),lt(0,e1));
            if(!any(ev)) { xl = xr; xr = x0+h; e0 = e1; e1 = event(xr,y1); ev = and(lt(e0,0),lt(0,e1)); }
            if(any(ev)) {
                var xc, yc, en,ei;
                var side=0, sl = 1.0, sr = 1.0;
                while(1) {
                    if(typeof e0 === "number") xi = (sr*e1*xl-sl*e0*xr)/(sr*e1-sl*e0);
                    else {
                        xi = xr;
                        for(j=e0.length-1;j!==-1;--j) {
                            if(e0[j]<0 && e1[j]>0) xi = min(xi,(sr*e1[j]*xl-sl*e0[j]*xr)/(sr*e1[j]-sl*e0[j]));
                        }
                    }
                    if(xi <= xl || xi >= xr) break;
                    yi = ret._at(xi, i-1);
                    ei = event(xi,yi);
                    en = and(lt(e0,0),lt(0,ei));
                    if(any(en)) {
                        xr = xi;
                        e1 = ei;
                        ev = en;
                        sr = 1.0;
                        if(side === -1) sl *= 0.5;
                        else sl = 1.0;
                        side = -1;
                    } else {
                        xl = xi;
                        e0 = ei;
                        sl = 1.0;
                        if(side === 1) sr *= 0.5;
                        else sr = 1.0;
                        side = 1;
                    }
                }
                y1 = ret._at(0.5*(x0+xi),i-1);
                ret.f[i] = f(xi,yi);
                ret.x[i] = xi;
                ret.y[i] = yi;
                ret.ymid[i-1] = y1;
                ret.events = ev;
                ret.iterations = it;
                return ret;
            }
        }
        x0 += h;
        y0 = y1;
        e0 = e1;
        h = min(0.8*h*pow(tol/erinf,0.25),4*h);
    }
    ret.iterations = it;
    return ret;
}

// 11. Ax = b
numeric.LU = function(A, fast) {
  fast = fast || false;

  var abs = Math.abs;
  var i, j, k, absAjk, Akk, Ak, Pk, Ai;
  var max;
  var n = A.length, n1 = n-1;
  var P = new Array(n);
  if(!fast) A = numeric.clone(A);

  for (k = 0; k < n; ++k) {
    Pk = k;
    Ak = A[k];
    max = abs(Ak[k]);
    for (j = k + 1; j < n; ++j) {
      absAjk = abs(A[j][k]);
      if (max < absAjk) {
        max = absAjk;
        Pk = j;
      }
    }
    P[k] = Pk;

    if (Pk != k) {
      A[k] = A[Pk];
      A[Pk] = Ak;
      Ak = A[k];
    }

    Akk = Ak[k];

    for (i = k + 1; i < n; ++i) {
      A[i][k] /= Akk;
    }

    for (i = k + 1; i < n; ++i) {
      Ai = A[i];
      for (j = k + 1; j < n1; ++j) {
        Ai[j] -= Ai[k] * Ak[j];
        ++j;
        Ai[j] -= Ai[k] * Ak[j];
      }
      if(j===n1) Ai[j] -= Ai[k] * Ak[j];
    }
  }

  return {
    LU: A,
    P:  P
  };
}

numeric.LUsolve = function LUsolve(LUP, b) {
  var i, j;
  var LU = LUP.LU;
  var n   = LU.length;
  var x = numeric.clone(b);
  var P   = LUP.P;
  var Pi, LUi, LUii, tmp;

  for (i=n-1;i!==-1;--i) x[i] = b[i];
  for (i = 0; i < n; ++i) {
    Pi = P[i];
    if (P[i] !== i) {
      tmp = x[i];
      x[i] = x[Pi];
      x[Pi] = tmp;
    }

    LUi = LU[i];
    for (j = 0; j < i; ++j) {
      x[i] -= x[j] * LUi[j];
    }
  }

  for (i = n - 1; i >= 0; --i) {
    LUi = LU[i];
    for (j = i + 1; j < n; ++j) {
      x[i] -= x[j] * LUi[j];
    }

    x[i] /= LUi[i];
  }

  return x;
}

numeric.solve = function solve(A,b,fast) { return numeric.LUsolve(numeric.LU(A,fast), b); }

// 12. Linear programming
numeric.echelonize = function echelonize(A) {
    var s = numeric.dim(A), m = s[0], n = s[1];
    var I = numeric.identity(m);
    var P = Array(m);
    var i,j,k,l,Ai,Ii,Z,a;
    var abs = Math.abs;
    var diveq = numeric.diveq;
    A = numeric.clone(A);
    for(i=0;i<m;++i) {
        k = 0;
        Ai = A[i];
        Ii = I[i];
        for(j=1;j<n;++j) if(abs(Ai[k])<abs(Ai[j])) k=j;
        P[i] = k;
        diveq(Ii,Ai[k]);
        diveq(Ai,Ai[k]);
        for(j=0;j<m;++j) if(j!==i) {
            Z = A[j]; a = Z[k];
            for(l=n-1;l!==-1;--l) Z[l] -= Ai[l]*a;
            Z = I[j];
            for(l=m-1;l!==-1;--l) Z[l] -= Ii[l]*a;
        }
    }
    return {I:I, A:A, P:P};
}

numeric.__solveLP = function __solveLP(c,A,b,tol,maxit,x,flag) {
    var sum = numeric.sum, log = numeric.log, mul = numeric.mul, sub = numeric.sub, dot = numeric.dot, div = numeric.div, add = numeric.add;
    var m = c.length, n = b.length,y;
    var unbounded = false, cb,i0=0;
    var alpha = 1.0;
    var f0,df0,AT = numeric.transpose(A), svd = numeric.svd,transpose = numeric.transpose,leq = numeric.leq, sqrt = Math.sqrt, abs = Math.abs;
    var muleq = numeric.muleq;
    var norm = numeric.norminf, any = numeric.any,min = Math.min;
    var all = numeric.all, gt = numeric.gt;
    var p = Array(m), A0 = Array(n),e=numeric.rep([n],1), H;
    var solve = numeric.solve, z = sub(b,dot(A,x)),count;
    var dotcc = dot(c,c);
    var g;
    for(count=i0;count<maxit;++count) {
        var i,j,d;
        for(i=n-1;i!==-1;--i) A0[i] = div(A[i],z[i]);
        var A1 = transpose(A0);
        for(i=m-1;i!==-1;--i) p[i] = (/*x[i]+*/sum(A1[i]));
        alpha = 0.25*abs(dotcc/dot(c,p));
        var a1 = 100*sqrt(dotcc/dot(p,p));
        if(!isFinite(alpha) || alpha>a1) alpha = a1;
        g = add(c,mul(alpha,p));
        H = dot(A1,A0);
        for(i=m-1;i!==-1;--i) H[i][i] += 1;
        d = solve(H,div(g,alpha),true);
        var t0 = div(z,dot(A,d));
        var t = 1.0;
        for(i=n-1;i!==-1;--i) if(t0[i]<0) t = min(t,-0.999*t0[i]);
        y = sub(x,mul(d,t));
        z = sub(b,dot(A,y));
        if(!all(gt(z,0))) return { solution: x, message: "", iterations: count };
        x = y;
        if(alpha<tol) return { solution: y, message: "", iterations: count };
        if(flag) {
            var s = dot(c,g), Ag = dot(A,g);
            unbounded = true;
            for(i=n-1;i!==-1;--i) if(s*Ag[i]<0) { unbounded = false; break; }
        } else {
            if(x[m-1]>=0) unbounded = false;
            else unbounded = true;
        }
        if(unbounded) return { solution: y, message: "Unbounded", iterations: count };
    }
    return { solution: x, message: "maximum iteration count exceeded", iterations:count };
}

numeric._solveLP = function _solveLP(c,A,b,tol,maxit) {
    var m = c.length, n = b.length,y;
    var sum = numeric.sum, log = numeric.log, mul = numeric.mul, sub = numeric.sub, dot = numeric.dot, div = numeric.div, add = numeric.add;
    var c0 = numeric.rep([m],0).concat([1]);
    var J = numeric.rep([n,1],-1);
    var A0 = numeric.blockMatrix([[A                   ,   J  ]]);
    var b0 = b;
    var y = numeric.rep([m],0).concat(Math.max(0,numeric.sup(numeric.neg(b)))+1);
    var x0 = numeric.__solveLP(c0,A0,b0,tol,maxit,y,false);
    var x = numeric.clone(x0.solution);
    x.length = m;
    var foo = numeric.inf(sub(b,dot(A,x)));
    if(foo<0) { return { solution: NaN, message: "Infeasible", iterations: x0.iterations }; }
    var ret = numeric.__solveLP(c, A, b, tol, maxit-x0.iterations, x, true);
    ret.iterations += x0.iterations;
    return ret;
};

numeric.solveLP = function solveLP(c,A,b,Aeq,beq,tol,maxit) {
    if(typeof maxit === "undefined") maxit = 1000;
    if(typeof tol === "undefined") tol = numeric.epsilon;
    if(typeof Aeq === "undefined") return numeric._solveLP(c,A,b,tol,maxit);
    var m = Aeq.length, n = Aeq[0].length, o = A.length;
    var B = numeric.echelonize(Aeq);
    var flags = numeric.rep([n],0);
    var P = B.P;
    var Q = [];
    var i;
    for(i=P.length-1;i!==-1;--i) flags[P[i]] = 1;
    for(i=n-1;i!==-1;--i) if(flags[i]===0) Q.push(i);
    var g = numeric.getRange;
    var I = numeric.linspace(0,m-1), J = numeric.linspace(0,o-1);
    var Aeq2 = g(Aeq,I,Q), A1 = g(A,J,P), A2 = g(A,J,Q), dot = numeric.dot, sub = numeric.sub;
    var A3 = dot(A1,B.I);
    var A4 = sub(A2,dot(A3,Aeq2)), b4 = sub(b,dot(A3,beq));
    var c1 = Array(P.length), c2 = Array(Q.length);
    for(i=P.length-1;i!==-1;--i) c1[i] = c[P[i]];
    for(i=Q.length-1;i!==-1;--i) c2[i] = c[Q[i]];
    var c4 = sub(c2,dot(c1,dot(B.I,Aeq2)));
    var S = numeric._solveLP(c4,A4,b4,tol,maxit);
    var x2 = S.solution;
    if(x2!==x2) return S;
    var x1 = dot(B.I,sub(beq,dot(Aeq2,x2)));
    var x = Array(c.length);
    for(i=P.length-1;i!==-1;--i) x[P[i]] = x1[i];
    for(i=Q.length-1;i!==-1;--i) x[Q[i]] = x2[i];
    return { solution: x, message:S.message, iterations: S.iterations };
}

numeric.MPStoLP = function MPStoLP(MPS) {
    if(MPS instanceof String) { MPS.split('\n'); }
    var state = 0;
    var states = ['Initial state','NAME','ROWS','COLUMNS','RHS','BOUNDS','ENDATA'];
    var n = MPS.length;
    var i,j,z,N=0,rows = {}, sign = [], rl = 0, vars = {}, nv = 0;
    var name;
    var c = [], A = [], b = [];
    function err(e) { throw new Error('MPStoLP: '+e+'\nLine '+i+': '+MPS[i]+'\nCurrent state: '+states[state]+'\n'); }
    for(i=0;i<n;++i) {
        z = MPS[i];
        var w0 = z.match(/\S*/g);
        var w = [];
        for(j=0;j<w0.length;++j) if(w0[j]!=="") w.push(w0[j]);
        if(w.length === 0) continue;
        for(j=0;j<states.length;++j) if(z.substr(0,states[j].length) === states[j]) break;
        if(j<states.length) {
            state = j;
            if(j===1) { name = w[1]; }
            if(j===6) return { name:name, c:c, A:numeric.transpose(A), b:b, rows:rows, vars:vars };
            continue;
        }
        switch(state) {
        case 0: case 1: err('Unexpected line');
        case 2: 
            switch(w[0]) {
            case 'N': if(N===0) N = w[1]; else err('Two or more N rows'); break;
            case 'L': rows[w[1]] = rl; sign[rl] = 1; b[rl] = 0; ++rl; break;
            case 'G': rows[w[1]] = rl; sign[rl] = -1;b[rl] = 0; ++rl; break;
            case 'E': rows[w[1]] = rl; sign[rl] = 0;b[rl] = 0; ++rl; break;
            default: err('Parse error '+numeric.prettyPrint(w));
            }
            break;
        case 3:
            if(!vars.hasOwnProperty(w[0])) { vars[w[0]] = nv; c[nv] = 0; A[nv] = numeric.rep([rl],0); ++nv; }
            var p = vars[w[0]];
            for(j=1;j<w.length;j+=2) {
                if(w[j] === N) { c[p] = parseFloat(w[j+1]); continue; }
                var q = rows[w[j]];
                A[p][q] = (sign[q]<0?-1:1)*parseFloat(w[j+1]);
            }
            break;
        case 4:
            for(j=1;j<w.length;j+=2) b[rows[w[j]]] = (sign[rows[w[j]]]<0?-1:1)*parseFloat(w[j+1]);
            break;
        case 5: /*FIXME*/ break;
        case 6: err('Internal error');
        }
    }
    err('Reached end of file without ENDATA');
}
// seedrandom.js version 2.0.
// Author: David Bau 4/2/2011
//
// Defines a method Math.seedrandom() that, when called, substitutes
// an explicitly seeded RC4-based algorithm for Math.random().  Also
// supports automatic seeding from local or network sources of entropy.
//
// Usage:
//
//   <script src=http://davidbau.com/encode/seedrandom-min.js></script>
//
//   Math.seedrandom('yipee'); Sets Math.random to a function that is
//                             initialized using the given explicit seed.
//
//   Math.seedrandom();        Sets Math.random to a function that is
//                             seeded using the current time, dom state,
//                             and other accumulated local entropy.
//                             The generated seed string is returned.
//
//   Math.seedrandom('yowza', true);
//                             Seeds using the given explicit seed mixed
//                             together with accumulated entropy.
//
//   <script src="http://bit.ly/srandom-512"></script>
//                             Seeds using physical random bits downloaded
//                             from random.org.
//
//   <script src="https://jsonlib.appspot.com/urandom?callback=Math.seedrandom">
//   </script>                 Seeds using urandom bits from call.jsonlib.com,
//                             which is faster than random.org.
//
// Examples:
//
//   Math.seedrandom("hello");            // Use "hello" as the seed.
//   document.write(Math.random());       // Always 0.5463663768140734
//   document.write(Math.random());       // Always 0.43973793770592234
//   var rng1 = Math.random;              // Remember the current prng.
//
//   var autoseed = Math.seedrandom();    // New prng with an automatic seed.
//   document.write(Math.random());       // Pretty much unpredictable.
//
//   Math.random = rng1;                  // Continue "hello" prng sequence.
//   document.write(Math.random());       // Always 0.554769432473455
//
//   Math.seedrandom(autoseed);           // Restart at the previous seed.
//   document.write(Math.random());       // Repeat the 'unpredictable' value.
//
// Notes:
//
// Each time seedrandom('arg') is called, entropy from the passed seed
// is accumulated in a pool to help generate future seeds for the
// zero-argument form of Math.seedrandom, so entropy can be injected over
// time by calling seedrandom with explicit data repeatedly.
//
// On speed - This javascript implementation of Math.random() is about
// 3-10x slower than the built-in Math.random() because it is not native
// code, but this is typically fast enough anyway.  Seeding is more expensive,
// especially if you use auto-seeding.  Some details (timings on Chrome 4):
//
// Our Math.random()            - avg less than 0.002 milliseconds per call
// seedrandom('explicit')       - avg less than 0.5 milliseconds per call
// seedrandom('explicit', true) - avg less than 2 milliseconds per call
// seedrandom()                 - avg about 38 milliseconds per call
//
// LICENSE (BSD):
//
// Copyright 2010 David Bau, all rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
// 
//   1. Redistributions of source code must retain the above copyright
//      notice, this list of conditions and the following disclaimer.
//
//   2. Redistributions in binary form must reproduce the above copyright
//      notice, this list of conditions and the following disclaimer in the
//      documentation and/or other materials provided with the distribution.
// 
//   3. Neither the name of this module nor the names of its contributors may
//      be used to endorse or promote products derived from this software
//      without specific prior written permission.
// 
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
/**
 * All code is in an anonymous closure to keep the global namespace clean.
 *
 * @param {number=} overflow 
 * @param {number=} startdenom
 */

// Patched by Seb so that seedrandom.js does not pollute the Math object.
// My tests suggest that doing Math.trouble = 1 makes Math lookups about 5%
// slower.
numeric.seedrandom = { pow:Math.pow, random:Math.random };

(function (pool, math, width, chunks, significance, overflow, startdenom) {


//
// seedrandom()
// This is the seedrandom function described above.
//
math['seedrandom'] = function seedrandom(seed, use_entropy) {
  var key = [];
  var arc4;

  // Flatten the seed string or build one from local entropy if needed.
  seed = mixkey(flatten(
    use_entropy ? [seed, pool] :
    arguments.length ? seed :
    [new Date().getTime(), pool, window], 3), key);

  // Use the seed to initialize an ARC4 generator.
  arc4 = new ARC4(key);

  // Mix the randomness into accumulated entropy.
  mixkey(arc4.S, pool);

  // Override Math.random

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.

  math['random'] = function random() {  // Closure to return a random double:
    var n = arc4.g(chunks);             // Start with a numerator n < 2 ^ 48
    var d = startdenom;                 //   and denominator d = 2 ^ 48.
    var x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };

  // Return the seed that was used
  return seed;
};

//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
/** @constructor */
function ARC4(key) {
  var t, u, me = this, keylen = key.length;
  var i = 0, j = me.i = me.j = me.m = 0;
  me.S = [];
  me.c = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) { me.S[i] = i++; }
  for (i = 0; i < width; i++) {
    t = me.S[i];
    j = lowbits(j + t + key[i % keylen]);
    u = me.S[j];
    me.S[i] = u;
    me.S[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  me.g = function getnext(count) {
    var s = me.S;
    var i = lowbits(me.i + 1); var t = s[i];
    var j = lowbits(me.j + t); var u = s[j];
    s[i] = u;
    s[j] = t;
    var r = s[lowbits(t + u)];
    while (--count) {
      i = lowbits(i + 1); t = s[i];
      j = lowbits(j + t); u = s[j];
      s[i] = u;
      s[j] = t;
      r = r * width + s[lowbits(t + u)];
    }
    me.i = i;
    me.j = j;
    return r;
  };
  // For robust unpredictability discard an initial batch of values.
  // See http://www.rsa.com/rsalabs/node.asp?id=2009
  me.g(width);
}

//
// flatten()
// Converts an object tree to nested arrays of strings.
//
/** @param {Object=} result 
  * @param {string=} prop
  * @param {string=} typ */
function flatten(obj, depth, result, prop, typ) {
  result = [];
  typ = typeof(obj);
  if (depth && typ == 'object') {
    for (prop in obj) {
      if (prop.indexOf('S') < 5) {    // Avoid FF3 bug (local/sessionStorage)
        try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
      }
    }
  }
  return (result.length ? result : obj + (typ != 'string' ? '\0' : ''));
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
/** @param {number=} smear 
  * @param {number=} j */
function mixkey(seed, key, smear, j) {
  seed += '';                         // Ensure the seed is a string
  smear = 0;
  for (j = 0; j < seed.length; j++) {
    key[lowbits(j)] =
      lowbits((smear ^= key[lowbits(j)] * 19) + seed.charCodeAt(j));
  }
  seed = '';
  for (j in key) { seed += String.fromCharCode(key[j]); }
  return seed;
}

//
// lowbits()
// A quick "n mod width" for width a power of 2.
//
function lowbits(n) { return n & (width - 1); }

//
// The following constants are related to IEEE 754 limits.
//
startdenom = math.pow(width, chunks);
significance = math.pow(2, significance);
overflow = significance * 2;

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to intefere with determinstic PRNG state later,
// seedrandom will not call math.random on its own again after
// initialization.
//
mixkey(math.random(), pool);

// End anonymous scope, and pass initial values.
}(
  [],   // pool: entropy pool starts empty
  numeric.seedrandom, // math: package containing random, pow, and seedrandom
  256,  // width: each RC4 output is 0 <= x < 256
  6,    // chunks: at least six RC4 outputs for each double
  52    // significance: there are 52 significant digits in a double
  ));
/* This file is a slightly modified version of quadprog.js from Alberto Santini.
 * It has been slightly modified by Sébastien Loisel to make sure that it handles
 * 0-based Arrays instead of 1-based Arrays.
 * License is in resources/LICENSE.quadprog */
(function(exports) {

function base0to1(A) {
    if(typeof A !== "object") { return A; }
    var ret = [], i,n=A.length;
    for(i=0;i<n;i++) ret[i+1] = base0to1(A[i]);
    return ret;
}
function base1to0(A) {
    if(typeof A !== "object") { return A; }
    var ret = [], i,n=A.length;
    for(i=1;i<n;i++) ret[i-1] = base1to0(A[i]);
    return ret;
}

function dpori(a, lda, n) {
    var i, j, k, kp1, t;

    for (k = 1; k <= n; k = k + 1) {
        a[k][k] = 1 / a[k][k];
        t = -a[k][k];
        //~ dscal(k - 1, t, a[1][k], 1);
        for (i = 1; i < k; i = i + 1) {
            a[i][k] = t * a[i][k];
        }

        kp1 = k + 1;
        if (n < kp1) {
            break;
        }
        for (j = kp1; j <= n; j = j + 1) {
            t = a[k][j];
            a[k][j] = 0;
            //~ daxpy(k, t, a[1][k], 1, a[1][j], 1);
            for (i = 1; i <= k; i = i + 1) {
                a[i][j] = a[i][j] + (t * a[i][k]);
            }
        }
    }

}

function dposl(a, lda, n, b) {
    var i, k, kb, t;

    for (k = 1; k <= n; k = k + 1) {
        //~ t = ddot(k - 1, a[1][k], 1, b[1], 1);
        t = 0;
        for (i = 1; i < k; i = i + 1) {
            t = t + (a[i][k] * b[i]);
        }

        b[k] = (b[k] - t) / a[k][k];
    }

    for (kb = 1; kb <= n; kb = kb + 1) {
        k = n + 1 - kb;
        b[k] = b[k] / a[k][k];
        t = -b[k];
        //~ daxpy(k - 1, t, a[1][k], 1, b[1], 1);
        for (i = 1; i < k; i = i + 1) {
            b[i] = b[i] + (t * a[i][k]);
        }
    }
}

function dpofa(a, lda, n, info) {
    var i, j, jm1, k, t, s;

    for (j = 1; j <= n; j = j + 1) {
        info[1] = j;
        s = 0;
        jm1 = j - 1;
        if (jm1 < 1) {
            s = a[j][j] - s;
            if (s <= 0) {
                break;
            }
            a[j][j] = Math.sqrt(s);
        } else {
            for (k = 1; k <= jm1; k = k + 1) {
                //~ t = a[k][j] - ddot(k - 1, a[1][k], 1, a[1][j], 1);
                t = a[k][j];
                for (i = 1; i < k; i = i + 1) {
                    t = t - (a[i][j] * a[i][k]);
                }
                t = t / a[k][k];
                a[k][j] = t;
                s = s + t * t;
            }
            s = a[j][j] - s;
            if (s <= 0) {
                break;
            }
            a[j][j] = Math.sqrt(s);
        }
        info[1] = 0;
    }
}

function qpgen2(dmat, dvec, fddmat, n, sol, crval, amat,
    bvec, fdamat, q, meq, iact, nact, iter, work, ierr) {

    var i, j, l, l1, info, it1, iwzv, iwrv, iwrm, iwsv, iwuv, nvl, r, iwnbv,
        temp, sum, t1, tt, gc, gs, nu,
        t1inf, t2min,
        vsmall, tmpa, tmpb,
        go;

    r = Math.min(n, q);
    l = 2 * n + (r * (r + 5)) / 2 + 2 * q + 1;

    vsmall = 1.0e-60;
    do {
        vsmall = vsmall + vsmall;
        tmpa = 1 + 0.1 * vsmall;
        tmpb = 1 + 0.2 * vsmall;
    } while (tmpa <= 1 || tmpb <= 1);

    for (i = 1; i <= n; i = i + 1) {
        work[i] = dvec[i];
    }
    for (i = n + 1; i <= l; i = i + 1) {
        work[i] = 0;
    }
    for (i = 1; i <= q; i = i + 1) {
        iact[i] = 0;
    }

    info = [];

    if (ierr[1] === 0) {
        dpofa(dmat, fddmat, n, info);
        if (info[1] !== 0) {
            ierr[1] = 2;
            return;
        }
        dposl(dmat, fddmat, n, dvec);
        dpori(dmat, fddmat, n);
    } else {
        for (j = 1; j <= n; j = j + 1) {
            sol[j] = 0;
            for (i = 1; i <= j; i = i + 1) {
                sol[j] = sol[j] + dmat[i][j] * dvec[i];
            }
        }
        for (j = 1; j <= n; j = j + 1) {
            dvec[j] = 0;
            for (i = j; i <= n; i = i + 1) {
                dvec[j] = dvec[j] + dmat[j][i] * sol[i];
            }
        }
    }

    crval[1] = 0;
    for (j = 1; j <= n; j = j + 1) {
        sol[j] = dvec[j];
        crval[1] = crval[1] + work[j] * sol[j];
        work[j] = 0;
        for (i = j + 1; i <= n; i = i + 1) {
            dmat[i][j] = 0;
        }
    }
    crval[1] = -crval[1] / 2;
    ierr[1] = 0;

    iwzv = n;
    iwrv = iwzv + n;
    iwuv = iwrv + r;
    iwrm = iwuv + r + 1;
    iwsv = iwrm + (r * (r + 1)) / 2;
    iwnbv = iwsv + q;

    for (i = 1; i <= q; i = i + 1) {
        sum = 0;
        for (j = 1; j <= n; j = j + 1) {
            sum = sum + amat[j][i] * amat[j][i];
        }
        work[iwnbv + i] = Math.sqrt(sum);
    }
    nact = 0;
    iter[1] = 0;
    iter[2] = 0;

    function fn_goto_50() {
        iter[1] = iter[1] + 1;

        l = iwsv;
        for (i = 1; i <= q; i = i + 1) {
            l = l + 1;
            sum = -bvec[i];
            for (j = 1; j <= n; j = j + 1) {
                sum = sum + amat[j][i] * sol[j];
            }
            if (Math.abs(sum) < vsmall) {
                sum = 0;
            }
            if (i > meq) {
                work[l] = sum;
            } else {
                work[l] = -Math.abs(sum);
                if (sum > 0) {
                    for (j = 1; j <= n; j = j + 1) {
                        amat[j][i] = -amat[j][i];
                    }
                    bvec[i] = -bvec[i];
                }
            }
        }

        for (i = 1; i <= nact; i = i + 1) {
            work[iwsv + iact[i]] = 0;
        }

        nvl = 0;
        temp = 0;
        for (i = 1; i <= q; i = i + 1) {
            if (work[iwsv + i] < temp * work[iwnbv + i]) {
                nvl = i;
                temp = work[iwsv + i] / work[iwnbv + i];
            }
        }
        if (nvl === 0) {
            return 999;
        }

        return 0;
    }

    function fn_goto_55() {
        for (i = 1; i <= n; i = i + 1) {
            sum = 0;
            for (j = 1; j <= n; j = j + 1) {
                sum = sum + dmat[j][i] * amat[j][nvl];
            }
            work[i] = sum;
        }

        l1 = iwzv;
        for (i = 1; i <= n; i = i + 1) {
            work[l1 + i] = 0;
        }
        for (j = nact + 1; j <= n; j = j + 1) {
            for (i = 1; i <= n; i = i + 1) {
                work[l1 + i] = work[l1 + i] + dmat[i][j] * work[j];
            }
        }

        t1inf = true;
        for (i = nact; i >= 1; i = i - 1) {
            sum = work[i];
            l = iwrm + (i * (i + 3)) / 2;
            l1 = l - i;
            for (j = i + 1; j <= nact; j = j + 1) {
                sum = sum - work[l] * work[iwrv + j];
                l = l + j;
            }
            sum = sum / work[l1];
            work[iwrv + i] = sum;
            if (iact[i] < meq) {
                // continue;
                break;
            }
            if (sum < 0) {
                // continue;
                break;
            }
            t1inf = false;
            it1 = i;
        }

        if (!t1inf) {
            t1 = work[iwuv + it1] / work[iwrv + it1];
            for (i = 1; i <= nact; i = i + 1) {
                if (iact[i] < meq) {
                    // continue;
                    break;
                }
                if (work[iwrv + i] < 0) {
                    // continue;
                    break;
                }
                temp = work[iwuv + i] / work[iwrv + i];
                if (temp < t1) {
                    t1 = temp;
                    it1 = i;
                }
            }
        }

        sum = 0;
        for (i = iwzv + 1; i <= iwzv + n; i = i + 1) {
            sum = sum + work[i] * work[i];
        }
        if (Math.abs(sum) <= vsmall) {
            if (t1inf) {
                ierr[1] = 1;
                // GOTO 999
                return 999;
            } else {
                for (i = 1; i <= nact; i = i + 1) {
                    work[iwuv + i] = work[iwuv + i] - t1 * work[iwrv + i];
                }
                work[iwuv + nact + 1] = work[iwuv + nact + 1] + t1;
                // GOTO 700
                return 700;
            }
        } else {
            sum = 0;
            for (i = 1; i <= n; i = i + 1) {
                sum = sum + work[iwzv + i] * amat[i][nvl];
            }
            tt = -work[iwsv + nvl] / sum;
            t2min = true;
            if (!t1inf) {
                if (t1 < tt) {
                    tt = t1;
                    t2min = false;
                }
            }

            for (i = 1; i <= n; i = i + 1) {
                sol[i] = sol[i] + tt * work[iwzv + i];
                if (Math.abs(sol[i]) < vsmall) {
                    sol[i] = 0;
                }
            }

            crval[1] = crval[1] + tt * sum * (tt / 2 + work[iwuv + nact + 1]);
            for (i = 1; i <= nact; i = i + 1) {
                work[iwuv + i] = work[iwuv + i] - tt * work[iwrv + i];
            }
            work[iwuv + nact + 1] = work[iwuv + nact + 1] + tt;

            if (t2min) {
                nact = nact + 1;
                iact[nact] = nvl;

                l = iwrm + ((nact - 1) * nact) / 2 + 1;
                for (i = 1; i <= nact - 1; i = i + 1) {
                    work[l] = work[i];
                    l = l + 1;
                }

                if (nact === n) {
                    work[l] = work[n];
                } else {
                    for (i = n; i >= nact + 1; i = i - 1) {
                        if (work[i] === 0) {
                            // continue;
                            break;
                        }
                        gc = Math.max(Math.abs(work[i - 1]), Math.abs(work[i]));
                        gs = Math.min(Math.abs(work[i - 1]), Math.abs(work[i]));
                        if (work[i - 1] >= 0) {
                            temp = Math.abs(gc * Math.sqrt(1 + gs * gs / (gc * gc)));
                        } else {
                            temp = -Math.abs(gc * Math.sqrt(1 + gs * gs / (gc * gc)));
                        }
                        gc = work[i - 1] / temp;
                        gs = work[i] / temp;

                        if (gc === 1) {
                            // continue;
                            break;
                        }
                        if (gc === 0) {
                            work[i - 1] = gs * temp;
                            for (j = 1; j <= n; j = j + 1) {
                                temp = dmat[j][i - 1];
                                dmat[j][i - 1] = dmat[j][i];
                                dmat[j][i] = temp;
                            }
                        } else {
                            work[i - 1] = temp;
                            nu = gs / (1 + gc);
                            for (j = 1; j <= n; j = j + 1) {
                                temp = gc * dmat[j][i - 1] + gs * dmat[j][i];
                                dmat[j][i] = nu * (dmat[j][i - 1] + temp) - dmat[j][i];
                                dmat[j][i - 1] = temp;

                            }
                        }
                    }
                    work[l] = work[nact];
                }
            } else {
                sum = -bvec[nvl];
                for (j = 1; j <= n; j = j + 1) {
                    sum = sum + sol[j] * amat[j][nvl];
                }
                if (nvl > meq) {
                    work[iwsv + nvl] = sum;
                } else {
                    work[iwsv + nvl] = -Math.abs(sum);
                    if (sum > 0) {
                        for (j = 1; j <= n; j = j + 1) {
                            amat[j][nvl] = -amat[j][nvl];
                        }
                        bvec[nvl] = -bvec[nvl];
                    }
                }
                // GOTO 700
                return 700;
            }
        }

        return 0;
    }

    function fn_goto_797() {
        l = iwrm + (it1 * (it1 + 1)) / 2 + 1;
        l1 = l + it1;
        if (work[l1] === 0) {
            // GOTO 798
            return 798;
        }
        gc = Math.max(Math.abs(work[l1 - 1]), Math.abs(work[l1]));
        gs = Math.min(Math.abs(work[l1 - 1]), Math.abs(work[l1]));
        if (work[l1 - 1] >= 0) {
            temp = Math.abs(gc * Math.sqrt(1 + gs * gs / (gc * gc)));
        } else {
            temp = -Math.abs(gc * Math.sqrt(1 + gs * gs / (gc * gc)));
        }
        gc = work[l1 - 1] / temp;
        gs = work[l1] / temp;

        if (gc === 1) {
            // GOTO 798
            return 798;
        }
        if (gc === 0) {
            for (i = it1 + 1; i <= nact; i = i + 1) {
                temp = work[l1 - 1];
                work[l1 - 1] = work[l1];
                work[l1] = temp;
                l1 = l1 + i;
            }
            for (i = 1; i <= n; i = i + 1) {
                temp = dmat[i][it1];
                dmat[i][it1] = dmat[i][it1 + 1];
                dmat[i][it1 + 1] = temp;
            }
        } else {
            nu = gs / (1 + gc);
            for (i = it1 + 1; i <= nact; i = i + 1) {
                temp = gc * work[l1 - 1] + gs * work[l1];
                work[l1] = nu * (work[l1 - 1] + temp) - work[l1];
                work[l1 - 1] = temp;
                l1 = l1 + i;
            }
            for (i = 1; i <= n; i = i + 1) {
                temp = gc * dmat[i][it1] + gs * dmat[i][it1 + 1];
                dmat[i][it1 + 1] = nu * (dmat[i][it1] + temp) - dmat[i][it1 + 1];
                dmat[i][it1] = temp;
            }
        }

        return 0;
    }

    function fn_goto_798() {
        l1 = l - it1;
        for (i = 1; i <= it1; i = i + 1) {
            work[l1] = work[l];
            l = l + 1;
            l1 = l1 + 1;
        }

        work[iwuv + it1] = work[iwuv + it1 + 1];
        iact[it1] = iact[it1 + 1];
        it1 = it1 + 1;
        if (it1 < nact) {
            // GOTO 797
            return 797;
        }

        return 0;
    }

    function fn_goto_799() {
        work[iwuv + nact] = work[iwuv + nact + 1];
        work[iwuv + nact + 1] = 0;
        iact[nact] = 0;
        nact = nact - 1;
        iter[2] = iter[2] + 1;

        return 0;
    }

    go = 0;
    while (true) {
        go = fn_goto_50();
        if (go === 999) {
            return;
        }
        while (true) {
            go = fn_goto_55();
            if (go === 0) {
                break;
            }
            if (go === 999) {
                return;
            }
            if (go === 700) {
                if (it1 === nact) {
                    fn_goto_799();
                } else {
                    while (true) {
                        fn_goto_797();
                        go = fn_goto_798();
                        if (go !== 797) {
                            break;
                        }
                    }
                    fn_goto_799();
                }
            }
        }
    }

}

function solveQP(Dmat, dvec, Amat, bvec, meq, factorized) {
    Dmat = base0to1(Dmat);
    dvec = base0to1(dvec);
    Amat = base0to1(Amat);
    var i, n, q,
        nact, r,
        crval = [], iact = [], sol = [], work = [], iter = [],
        message;

    meq = meq || 0;
    factorized = factorized ? base0to1(factorized) : [undefined, 0];
    bvec = bvec ? base0to1(bvec) : [];

    // In Fortran the array index starts from 1
    n = Dmat.length - 1;
    q = Amat[1].length - 1;

    if (!bvec) {
        for (i = 1; i <= q; i = i + 1) {
            bvec[i] = 0;
        }
    }
    for (i = 1; i <= q; i = i + 1) {
        iact[i] = 0;
    }
    nact = 0;
    r = Math.min(n, q);
    for (i = 1; i <= n; i = i + 1) {
        sol[i] = 0;
    }
    crval[1] = 0;
    for (i = 1; i <= (2 * n + (r * (r + 5)) / 2 + 2 * q + 1); i = i + 1) {
        work[i] = 0;
    }
    for (i = 1; i <= 2; i = i + 1) {
        iter[i] = 0;
    }

    qpgen2(Dmat, dvec, n, n, sol, crval, Amat,
        bvec, n, q, meq, iact, nact, iter, work, factorized);

    message = "";
    if (factorized[1] === 1) {
        message = "constraints are inconsistent, no solution!";
    }
    if (factorized[1] === 2) {
        message = "matrix D in quadratic function is not positive definite!";
    }

    return {
        solution: base1to0(sol),
        value: base1to0(crval),
        unconstrained_solution: base1to0(dvec),
        iterations: base1to0(iter),
        iact: base1to0(iact),
        message: message
    };
}
exports.solveQP = solveQP;
}(numeric));
/*
Shanti Rao sent me this routine by private email. I had to modify it
slightly to work on Arrays instead of using a Matrix object.
It is apparently translated from http://stitchpanorama.sourceforge.net/Python/svd.py
*/

numeric.svd= function svd(A) {
    var temp;
//Compute the thin SVD from G. H. Golub and C. Reinsch, Numer. Math. 14, 403-420 (1970)
	var prec= numeric.epsilon; //Math.pow(2,-52) // assumes double prec
	var tolerance= 1.e-64/prec;
	var itmax= 50;
	var c=0;
	var i=0;
	var j=0;
	var k=0;
	var l=0;
	
	var u= numeric.clone(A);
	var m= u.length;
	
	var n= u[0].length;
	
	if (m < n) throw "Need more rows than columns"
	
	var e = new Array(n);
	var q = new Array(n);
	for (i=0; i<n; i++) e[i] = q[i] = 0.0;
	var v = numeric.rep([n,n],0);
//	v.zero();
	
 	function pythag(a,b)
 	{
		a = Math.abs(a)
		b = Math.abs(b)
		if (a > b)
			return a*Math.sqrt(1.0+(b*b/a/a))
		else if (b == 0.0) 
			return a
		return b*Math.sqrt(1.0+(a*a/b/b))
	}

	//Householder's reduction to bidiagonal form

	var f= 0.0;
	var g= 0.0;
	var h= 0.0;
	var x= 0.0;
	var y= 0.0;
	var z= 0.0;
	var s= 0.0;
	
	for (i=0; i < n; i++)
	{	
		e[i]= g;
		s= 0.0;
		l= i+1;
		for (j=i; j < m; j++) 
			s += (u[j][i]*u[j][i]);
		if (s <= tolerance)
			g= 0.0;
		else
		{	
			f= u[i][i];
			g= Math.sqrt(s);
			if (f >= 0.0) g= -g;
			h= f*g-s
			u[i][i]=f-g;
			for (j=l; j < n; j++)
			{
				s= 0.0
				for (k=i; k < m; k++) 
					s += u[k][i]*u[k][j]
				f= s/h
				for (k=i; k < m; k++) 
					u[k][j]+=f*u[k][i]
			}
		}
		q[i]= g
		s= 0.0
		for (j=l; j < n; j++) 
			s= s + u[i][j]*u[i][j]
		if (s <= tolerance)
			g= 0.0
		else
		{	
			f= u[i][i+1]
			g= Math.sqrt(s)
			if (f >= 0.0) g= -g
			h= f*g - s
			u[i][i+1] = f-g;
			for (j=l; j < n; j++) e[j]= u[i][j]/h
			for (j=l; j < m; j++)
			{	
				s=0.0
				for (k=l; k < n; k++) 
					s += (u[j][k]*u[i][k])
				for (k=l; k < n; k++) 
					u[j][k]+=s*e[k]
			}	
		}
		y= Math.abs(q[i])+Math.abs(e[i])
		if (y>x) 
			x=y
	}
	
	// accumulation of right hand gtransformations
	for (i=n-1; i != -1; i+= -1)
	{	
		if (g != 0.0)
		{
		 	h= g*u[i][i+1]
			for (j=l; j < n; j++) 
				v[j][i]=u[i][j]/h
			for (j=l; j < n; j++)
			{	
				s=0.0
				for (k=l; k < n; k++) 
					s += u[i][k]*v[k][j]
				for (k=l; k < n; k++) 
					v[k][j]+=(s*v[k][i])
			}	
		}
		for (j=l; j < n; j++)
		{
			v[i][j] = 0;
			v[j][i] = 0;
		}
		v[i][i] = 1;
		g= e[i]
		l= i
	}
	
	// accumulation of left hand transformations
	for (i=n-1; i != -1; i+= -1)
	{	
		l= i+1
		g= q[i]
		for (j=l; j < n; j++) 
			u[i][j] = 0;
		if (g != 0.0)
		{
			h= u[i][i]*g
			for (j=l; j < n; j++)
			{
				s=0.0
				for (k=l; k < m; k++) s += u[k][i]*u[k][j];
				f= s/h
				for (k=i; k < m; k++) u[k][j]+=f*u[k][i];
			}
			for (j=i; j < m; j++) u[j][i] = u[j][i]/g;
		}
		else
			for (j=i; j < m; j++) u[j][i] = 0;
		u[i][i] += 1;
	}
	
	// diagonalization of the bidiagonal form
	prec= prec*x
	for (k=n-1; k != -1; k+= -1)
	{
		for (var iteration=0; iteration < itmax; iteration++)
		{	// test f splitting
			var test_convergence = false
			for (l=k; l != -1; l+= -1)
			{	
				if (Math.abs(e[l]) <= prec)
				{	test_convergence= true
					break 
				}
				if (Math.abs(q[l-1]) <= prec)
					break 
			}
			if (!test_convergence)
			{	// cancellation of e[l] if l>0
				c= 0.0
				s= 1.0
				var l1= l-1
				for (i =l; i<k+1; i++)
				{	
					f= s*e[i]
					e[i]= c*e[i]
					if (Math.abs(f) <= prec)
						break
					g= q[i]
					h= pythag(f,g)
					q[i]= h
					c= g/h
					s= -f/h
					for (j=0; j < m; j++)
					{	
						y= u[j][l1]
						z= u[j][i]
						u[j][l1] =  y*c+(z*s)
						u[j][i] = -y*s+(z*c)
					} 
				}	
			}
			// test f convergence
			z= q[k]
			if (l== k)
			{	//convergence
				if (z<0.0)
				{	//q[k] is made non-negative
					q[k]= -z
					for (j=0; j < n; j++)
						v[j][k] = -v[j][k]
				}
				break  //break out of iteration loop and move on to next k value
			}
			if (iteration >= itmax-1)
				throw 'Error: no convergence.'
			// shift from bottom 2x2 minor
			x= q[l]
			y= q[k-1]
			g= e[k-1]
			h= e[k]
			f= ((y-z)*(y+z)+(g-h)*(g+h))/(2.0*h*y)
			g= pythag(f,1.0)
			if (f < 0.0)
				f= ((x-z)*(x+z)+h*(y/(f-g)-h))/x
			else
				f= ((x-z)*(x+z)+h*(y/(f+g)-h))/x
			// next QR transformation
			c= 1.0
			s= 1.0
			for (i=l+1; i< k+1; i++)
			{	
				g= e[i]
				y= q[i]
				h= s*g
				g= c*g
				z= pythag(f,h)
				e[i-1]= z
				c= f/z
				s= h/z
				f= x*c+g*s
				g= -x*s+g*c
				h= y*s
				y= y*c
				for (j=0; j < n; j++)
				{	
					x= v[j][i-1]
					z= v[j][i]
					v[j][i-1] = x*c+z*s
					v[j][i] = -x*s+z*c
				}
				z= pythag(f,h)
				q[i-1]= z
				c= f/z
				s= h/z
				f= c*g+s*y
				x= -s*g+c*y
				for (j=0; j < m; j++)
				{
					y= u[j][i-1]
					z= u[j][i]
					u[j][i-1] = y*c+z*s
					u[j][i] = -y*s+z*c
				}
			}
			e[l]= 0.0
			e[k]= f
			q[k]= x
		} 
	}
		
	//vt= transpose(v)
	//return (u,q,vt)
	for (i=0;i<q.length; i++) 
	  if (q[i] < prec) q[i] = 0
	  
	//sort eigenvalues	
	for (i=0; i< n; i++)
	{	 
	//writeln(q)
	 for (j=i-1; j >= 0; j--)
	 {
	  if (q[j] < q[i])
	  {
	//  writeln(i,'-',j)
	   c = q[j]
	   q[j] = q[i]
	   q[i] = c
	   for(k=0;k<u.length;k++) { temp = u[k][i]; u[k][i] = u[k][j]; u[k][j] = temp; }
	   for(k=0;k<v.length;k++) { temp = v[k][i]; v[k][i] = v[k][j]; v[k][j] = temp; }
//	   u.swapCols(i,j)
//	   v.swapCols(i,j)
	   i = j	   
	  }
	 }	
	}
	
	return {U:u,S:q,V:v}
};


/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(17)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithHoles = __webpack_require__(14);

var iterableToArrayLimit = __webpack_require__(15);

var nonIterableRest = __webpack_require__(16);

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithoutHoles = __webpack_require__(11);

var iterableToArray = __webpack_require__(12);

var nonIterableSpread = __webpack_require__(13);

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(4);

var assertThisInitialized = __webpack_require__(18);

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var setPrototypeOf = __webpack_require__(19);

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

module.exports = _inherits;

/***/ }),
/* 9 */
/***/ (function(module, exports) {



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, __dirname) {/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__);


var mvtdstpack = function () {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;

  return function (mvtdstpack) {
    mvtdstpack = mvtdstpack || {};
    var Module = typeof mvtdstpack !== "undefined" ? mvtdstpack : {};
    var moduleOverrides = {};
    var key;

    for (key in Module) {
      if (Module.hasOwnProperty(key)) {
        moduleOverrides[key] = Module[key];
      }
    }

    Module["arguments"] = [];
    Module["thisProgram"] = "./this.program";

    Module["quit"] = function (status, toThrow) {
      throw toThrow;
    };

    Module["preRun"] = [];
    Module["postRun"] = [];
    var ENVIRONMENT_IS_WEB = false;
    var ENVIRONMENT_IS_WORKER = false;
    var ENVIRONMENT_IS_NODE = false;
    var ENVIRONMENT_IS_SHELL = false;
    ENVIRONMENT_IS_WEB = (typeof window === "undefined" ? "undefined" : _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default()(window)) === "object";
    ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
    ENVIRONMENT_IS_NODE = (typeof process === "undefined" ? "undefined" : _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default()(process)) === "object" && "function" === "function" && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER;
    ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
    var scriptDirectory = "";

    function locateFile(path) {
      if (Module["locateFile"]) {
        return Module["locateFile"](path, scriptDirectory);
      } else {
        return scriptDirectory + path;
      }
    }

    if (ENVIRONMENT_IS_NODE) {
      scriptDirectory = __dirname + "/";
      var nodeFS;
      var nodePath;

      Module["read"] = function shell_read(filename, binary) {
        var ret;
        if (!nodeFS) nodeFS = __webpack_require__(9);
        if (!nodePath) nodePath = __webpack_require__(9);
        filename = nodePath["normalize"](filename);
        ret = nodeFS["readFileSync"](filename);
        return binary ? ret : ret.toString();
      };

      Module["readBinary"] = function readBinary(filename) {
        var ret = Module["read"](filename, true);

        if (!ret.buffer) {
          ret = new Uint8Array(ret);
        }

        assert(ret.buffer);
        return ret;
      };

      if (process["argv"].length > 1) {
        Module["thisProgram"] = process["argv"][1].replace(/\\/g, "/");
      }

      Module["arguments"] = process["argv"].slice(2);
      process["on"]("uncaughtException", function (ex) {
        if (!(ex instanceof ExitStatus)) {
          throw ex;
        }
      });
      process["on"]("unhandledRejection", abort);

      Module["quit"] = function (status) {
        process["exit"](status);
      };

      Module["inspect"] = function () {
        return "[Emscripten Module object]";
      };
    } else if (ENVIRONMENT_IS_SHELL) {
      if (typeof read != "undefined") {
        Module["read"] = function shell_read(f) {
          return read(f);
        };
      }

      Module["readBinary"] = function readBinary(f) {
        var data;

        if (typeof readbuffer === "function") {
          return new Uint8Array(readbuffer(f));
        }

        data = read(f, "binary");
        assert(_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default()(data) === "object");
        return data;
      };

      if (typeof scriptArgs != "undefined") {
        Module["arguments"] = scriptArgs;
      } else if (typeof arguments != "undefined") {
        Module["arguments"] = arguments;
      }

      if (typeof quit === "function") {
        Module["quit"] = function (status) {
          quit(status);
        };
      }
    } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
      if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = self.location.href;
      } else if (document.currentScript) {
        scriptDirectory = document.currentScript.src;
      }

      if (_scriptDir) {
        scriptDirectory = _scriptDir;
      }

      if (scriptDirectory.indexOf("blob:") !== 0) {
        scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1);
      } else {
        scriptDirectory = "";
      }

      Module["read"] = function shell_read(url) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.send(null);
        return xhr.responseText;
      };

      if (ENVIRONMENT_IS_WORKER) {
        Module["readBinary"] = function readBinary(url) {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, false);
          xhr.responseType = "arraybuffer";
          xhr.send(null);
          return new Uint8Array(xhr.response);
        };
      }

      Module["readAsync"] = function readAsync(url, onload, onerror) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";

        xhr.onload = function xhr_onload() {
          if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
            onload(xhr.response);
            return;
          }

          onerror();
        };

        xhr.onerror = onerror;
        xhr.send(null);
      };

      Module["setWindowTitle"] = function (title) {
        document.title = title;
      };
    } else {}

    var out = Module["print"] || (typeof console !== "undefined" ? console.log.bind(console) : typeof print !== "undefined" ? print : null);
    var err = Module["printErr"] || (typeof printErr !== "undefined" ? printErr : typeof console !== "undefined" && console.warn.bind(console) || out);

    for (key in moduleOverrides) {
      if (moduleOverrides.hasOwnProperty(key)) {
        Module[key] = moduleOverrides[key];
      }
    }

    moduleOverrides = undefined;
    var asm2wasmImports = {
      "f64-rem": function f64Rem(x, y) {
        return x % y;
      },
      "debugger": function _debugger() {
        debugger;
      }
    };
    var functionPointers = new Array(0);
    var tempRet0 = 0;

    var setTempRet0 = function setTempRet0(value) {
      tempRet0 = value;
    };

    if ((typeof WebAssembly === "undefined" ? "undefined" : _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default()(WebAssembly)) !== "object") {
      err("no native wasm support detected");
    }

    var wasmMemory;
    var wasmTable;
    var ABORT = false;
    var EXITSTATUS = 0;

    function assert(condition, text) {
      if (!condition) {
        abort("Assertion failed: " + text);
      }
    }

    var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;

    function UTF8ArrayToString(u8Array, idx, maxBytesToRead) {
      var endIdx = idx + maxBytesToRead;
      var endPtr = idx;

      while (u8Array[endPtr] && !(endPtr >= endIdx)) {
        ++endPtr;
      }

      if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
        return UTF8Decoder.decode(u8Array.subarray(idx, endPtr));
      } else {
        var str = "";

        while (idx < endPtr) {
          var u0 = u8Array[idx++];

          if (!(u0 & 128)) {
            str += String.fromCharCode(u0);
            continue;
          }

          var u1 = u8Array[idx++] & 63;

          if ((u0 & 224) == 192) {
            str += String.fromCharCode((u0 & 31) << 6 | u1);
            continue;
          }

          var u2 = u8Array[idx++] & 63;

          if ((u0 & 240) == 224) {
            u0 = (u0 & 15) << 12 | u1 << 6 | u2;
          } else {
            u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | u8Array[idx++] & 63;
          }

          if (u0 < 65536) {
            str += String.fromCharCode(u0);
          } else {
            var ch = u0 - 65536;
            str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
          }
        }
      }

      return str;
    }

    function UTF8ToString(ptr, maxBytesToRead) {
      return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
    }

    function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
      if (!(maxBytesToWrite > 0)) return 0;
      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1;

      for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);

        if (u >= 55296 && u <= 57343) {
          var u1 = str.charCodeAt(++i);
          u = 65536 + ((u & 1023) << 10) | u1 & 1023;
        }

        if (u <= 127) {
          if (outIdx >= endIdx) break;
          outU8Array[outIdx++] = u;
        } else if (u <= 2047) {
          if (outIdx + 1 >= endIdx) break;
          outU8Array[outIdx++] = 192 | u >> 6;
          outU8Array[outIdx++] = 128 | u & 63;
        } else if (u <= 65535) {
          if (outIdx + 2 >= endIdx) break;
          outU8Array[outIdx++] = 224 | u >> 12;
          outU8Array[outIdx++] = 128 | u >> 6 & 63;
          outU8Array[outIdx++] = 128 | u & 63;
        } else {
          if (outIdx + 3 >= endIdx) break;
          outU8Array[outIdx++] = 240 | u >> 18;
          outU8Array[outIdx++] = 128 | u >> 12 & 63;
          outU8Array[outIdx++] = 128 | u >> 6 & 63;
          outU8Array[outIdx++] = 128 | u & 63;
        }
      }

      outU8Array[outIdx] = 0;
      return outIdx - startIdx;
    }

    function stringToUTF8(str, outPtr, maxBytesToWrite) {
      return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
    }

    function lengthBytesUTF8(str) {
      var len = 0;

      for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
        if (u <= 127) ++len;else if (u <= 2047) len += 2;else if (u <= 65535) len += 3;else len += 4;
      }

      return len;
    }

    var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined;
    var WASM_PAGE_SIZE = 65536;
    var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

    function updateGlobalBufferViews() {
      Module["HEAP8"] = HEAP8 = new Int8Array(buffer);
      Module["HEAP16"] = HEAP16 = new Int16Array(buffer);
      Module["HEAP32"] = HEAP32 = new Int32Array(buffer);
      Module["HEAPU8"] = HEAPU8 = new Uint8Array(buffer);
      Module["HEAPU16"] = HEAPU16 = new Uint16Array(buffer);
      Module["HEAPU32"] = HEAPU32 = new Uint32Array(buffer);
      Module["HEAPF32"] = HEAPF32 = new Float32Array(buffer);
      Module["HEAPF64"] = HEAPF64 = new Float64Array(buffer);
    }

    var DYNAMIC_BASE = 9531216,
        DYNAMICTOP_PTR = 4288304;
    var TOTAL_STACK = 5242880;
    var INITIAL_TOTAL_MEMORY = Module["TOTAL_MEMORY"] || 16777216;
    if (INITIAL_TOTAL_MEMORY < TOTAL_STACK) err("TOTAL_MEMORY should be larger than TOTAL_STACK, was " + INITIAL_TOTAL_MEMORY + "! (TOTAL_STACK=" + TOTAL_STACK + ")");

    if (Module["buffer"]) {
      buffer = Module["buffer"];
    } else {
      if ((typeof WebAssembly === "undefined" ? "undefined" : _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default()(WebAssembly)) === "object" && typeof WebAssembly.Memory === "function") {
        wasmMemory = new WebAssembly.Memory({
          "initial": INITIAL_TOTAL_MEMORY / WASM_PAGE_SIZE,
          "maximum": INITIAL_TOTAL_MEMORY / WASM_PAGE_SIZE
        });
        buffer = wasmMemory.buffer;
      } else {
        buffer = new ArrayBuffer(INITIAL_TOTAL_MEMORY);
      }
    }

    updateGlobalBufferViews();
    HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;

    function callRuntimeCallbacks(callbacks) {
      while (callbacks.length > 0) {
        var callback = callbacks.shift();

        if (typeof callback == "function") {
          callback();
          continue;
        }

        var func = callback.func;

        if (typeof func === "number") {
          if (callback.arg === undefined) {
            Module["dynCall_v"](func);
          } else {
            Module["dynCall_vi"](func, callback.arg);
          }
        } else {
          func(callback.arg === undefined ? null : callback.arg);
        }
      }
    }

    var __ATPRERUN__ = [];
    var __ATINIT__ = [];
    var __ATMAIN__ = [];
    var __ATPOSTRUN__ = [];
    var runtimeInitialized = false;

    function preRun() {
      if (Module["preRun"]) {
        if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];

        while (Module["preRun"].length) {
          addOnPreRun(Module["preRun"].shift());
        }
      }

      callRuntimeCallbacks(__ATPRERUN__);
    }

    function ensureInitRuntime() {
      if (runtimeInitialized) return;
      runtimeInitialized = true;
      callRuntimeCallbacks(__ATINIT__);
    }

    function preMain() {
      callRuntimeCallbacks(__ATMAIN__);
    }

    function postRun() {
      if (Module["postRun"]) {
        if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];

        while (Module["postRun"].length) {
          addOnPostRun(Module["postRun"].shift());
        }
      }

      callRuntimeCallbacks(__ATPOSTRUN__);
    }

    function addOnPreRun(cb) {
      __ATPRERUN__.unshift(cb);
    }

    function addOnPostRun(cb) {
      __ATPOSTRUN__.unshift(cb);
    }

    var runDependencies = 0;
    var runDependencyWatcher = null;
    var dependenciesFulfilled = null;

    function addRunDependency(id) {
      runDependencies++;

      if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies);
      }
    }

    function removeRunDependency(id) {
      runDependencies--;

      if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies);
      }

      if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
        }

        if (dependenciesFulfilled) {
          var callback = dependenciesFulfilled;
          dependenciesFulfilled = null;
          callback();
        }
      }
    }

    Module["preloadedImages"] = {};
    Module["preloadedAudios"] = {};
    var dataURIPrefix = "data:application/octet-stream;base64,";

    function isDataURI(filename) {
      return String.prototype.startsWith ? filename.startsWith(dataURIPrefix) : filename.indexOf(dataURIPrefix) === 0;
    }

    var wasmBinaryFile = "mvtdstpack.wasm";

    if (!isDataURI(wasmBinaryFile)) {
      wasmBinaryFile = locateFile(wasmBinaryFile);
    }

    function getBinary() {
      try {
        if (Module["wasmBinary"]) {
          return new Uint8Array(Module["wasmBinary"]);
        }

        if (Module["readBinary"]) {
          return Module["readBinary"](wasmBinaryFile);
        } else {
          throw "both async and sync fetching of the wasm failed";
        }
      } catch (err) {
        abort(err);
      }
    }

    function getBinaryPromise() {
      if (!Module["wasmBinary"] && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === "function") {
        return fetch(wasmBinaryFile, {
          credentials: "same-origin"
        }).then(function (response) {
          if (!response["ok"]) {
            throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
          }

          return response["arrayBuffer"]();
        })["catch"](function () {
          return getBinary();
        });
      }

      return new Promise(function (resolve, reject) {
        resolve(getBinary());
      });
    }

    function createWasm(env) {
      var info = {
        "env": env,
        "global": {
          "NaN": NaN,
          Infinity: Infinity
        },
        "global.Math": Math,
        "asm2wasm": asm2wasmImports
      };

      function receiveInstance(instance, module) {
        var exports = instance.exports;
        Module["asm"] = exports;
        removeRunDependency("wasm-instantiate");
      }

      addRunDependency("wasm-instantiate");

      if (Module["instantiateWasm"]) {
        try {
          return Module["instantiateWasm"](info, receiveInstance);
        } catch (e) {
          err("Module.instantiateWasm callback failed with error: " + e);
          return false;
        }
      }

      function receiveInstantiatedSource(output) {
        receiveInstance(output["instance"]);
      }

      function instantiateArrayBuffer(receiver) {
        getBinaryPromise().then(function (binary) {
          return WebAssembly.instantiate(binary, info);
        }).then(receiver, function (reason) {
          err("failed to asynchronously prepare wasm: " + reason);
          abort(reason);
        });
      }

      if (!Module["wasmBinary"] && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && typeof fetch === "function") {
        WebAssembly.instantiateStreaming(fetch(wasmBinaryFile, {
          credentials: "same-origin"
        }), info).then(receiveInstantiatedSource, function (reason) {
          err("wasm streaming compile failed: " + reason);
          err("falling back to ArrayBuffer instantiation");
          instantiateArrayBuffer(receiveInstantiatedSource);
        });
      } else {
        instantiateArrayBuffer(receiveInstantiatedSource);
      }

      return {};
    }

    Module["asm"] = function (global, env, providedBuffer) {
      env["memory"] = wasmMemory;
      env["table"] = wasmTable = new WebAssembly.Table({
        "initial": 110,
        "maximum": 110,
        "element": "anyfunc"
      });
      env["__memory_base"] = 1024;
      env["__table_base"] = 0;
      var exports = createWasm(env);
      return exports;
    };

    __ATINIT__.push({
      func: function func() {
        globalCtors();
      }
    });

    function ___cxa_allocate_exception(size) {
      return _malloc(size);
    }

    function __ZSt18uncaught_exceptionv() {
      return !!__ZSt18uncaught_exceptionv.uncaught_exception;
    }

    function ___cxa_free_exception(ptr) {
      try {
        return _free(ptr);
      } catch (e) {}
    }

    var EXCEPTIONS = {
      last: 0,
      caught: [],
      infos: {},
      deAdjust: function deAdjust(adjusted) {
        if (!adjusted || EXCEPTIONS.infos[adjusted]) return adjusted;

        for (var key in EXCEPTIONS.infos) {
          var ptr = +key;
          var adj = EXCEPTIONS.infos[ptr].adjusted;
          var len = adj.length;

          for (var i = 0; i < len; i++) {
            if (adj[i] === adjusted) {
              return ptr;
            }
          }
        }

        return adjusted;
      },
      addRef: function addRef(ptr) {
        if (!ptr) return;
        var info = EXCEPTIONS.infos[ptr];
        info.refcount++;
      },
      decRef: function decRef(ptr) {
        if (!ptr) return;
        var info = EXCEPTIONS.infos[ptr];
        assert(info.refcount > 0);
        info.refcount--;

        if (info.refcount === 0 && !info.rethrown) {
          if (info.destructor) {
            Module["dynCall_vi"](info.destructor, ptr);
          }

          delete EXCEPTIONS.infos[ptr];

          ___cxa_free_exception(ptr);
        }
      },
      clearRef: function clearRef(ptr) {
        if (!ptr) return;
        var info = EXCEPTIONS.infos[ptr];
        info.refcount = 0;
      }
    };

    function ___cxa_throw(ptr, type, destructor) {
      EXCEPTIONS.infos[ptr] = {
        ptr: ptr,
        adjusted: [ptr],
        type: type,
        destructor: destructor,
        refcount: 0,
        caught: false,
        rethrown: false
      };
      EXCEPTIONS.last = ptr;

      if (!("uncaught_exception" in __ZSt18uncaught_exceptionv)) {
        __ZSt18uncaught_exceptionv.uncaught_exception = 1;
      } else {
        __ZSt18uncaught_exceptionv.uncaught_exception++;
      }

      throw ptr;
    }

    var SYSCALLS = {
      buffers: [null, [], []],
      printChar: function printChar(stream, curr) {
        var buffer = SYSCALLS.buffers[stream];

        if (curr === 0 || curr === 10) {
          (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
          buffer.length = 0;
        } else {
          buffer.push(curr);
        }
      },
      varargs: 0,
      get: function get(varargs) {
        SYSCALLS.varargs += 4;
        var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
        return ret;
      },
      getStr: function getStr() {
        var ret = UTF8ToString(SYSCALLS.get());
        return ret;
      },
      get64: function get64() {
        var low = SYSCALLS.get(),
            high = SYSCALLS.get();
        return low;
      },
      getZero: function getZero() {
        SYSCALLS.get();
      }
    };

    function ___syscall140(which, varargs) {
      SYSCALLS.varargs = varargs;

      try {
        var stream = SYSCALLS.getStreamFromFD(),
            offset_high = SYSCALLS.get(),
            offset_low = SYSCALLS.get(),
            result = SYSCALLS.get(),
            whence = SYSCALLS.get();
        return 0;
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno;
      }
    }

    function ___syscall146(which, varargs) {
      SYSCALLS.varargs = varargs;

      try {
        var stream = SYSCALLS.get(),
            iov = SYSCALLS.get(),
            iovcnt = SYSCALLS.get();
        var ret = 0;

        for (var i = 0; i < iovcnt; i++) {
          var ptr = HEAP32[iov + i * 8 >> 2];
          var len = HEAP32[iov + (i * 8 + 4) >> 2];

          for (var j = 0; j < len; j++) {
            SYSCALLS.printChar(stream, HEAPU8[ptr + j]);
          }

          ret += len;
        }

        return ret;
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno;
      }
    }

    function ___syscall6(which, varargs) {
      SYSCALLS.varargs = varargs;

      try {
        var stream = SYSCALLS.getStreamFromFD();
        return 0;
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno;
      }
    }

    var structRegistrations = {};

    function runDestructors(destructors) {
      while (destructors.length) {
        var ptr = destructors.pop();
        var del = destructors.pop();
        del(ptr);
      }
    }

    function simpleReadValueFromPointer(pointer) {
      return this["fromWireType"](HEAPU32[pointer >> 2]);
    }

    var awaitingDependencies = {};
    var registeredTypes = {};
    var typeDependencies = {};
    var char_0 = 48;
    var char_9 = 57;

    function makeLegalFunctionName(name) {
      if (undefined === name) {
        return "_unknown";
      }

      name = name.replace(/[^a-zA-Z0-9_]/g, "$");
      var f = name.charCodeAt(0);

      if (f >= char_0 && f <= char_9) {
        return "_" + name;
      } else {
        return name;
      }
    }

    function createNamedFunction(name, body) {
      name = makeLegalFunctionName(name);
      return new Function("body", "return function " + name + "() {\n" + '    "use strict";' + "    return body.apply(this, arguments);\n" + "};\n")(body);
    }

    function extendError(baseErrorType, errorName) {
      var errorClass = createNamedFunction(errorName, function (message) {
        this.name = errorName;
        this.message = message;
        var stack = new Error(message).stack;

        if (stack !== undefined) {
          this.stack = this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "");
        }
      });
      errorClass.prototype = Object.create(baseErrorType.prototype);
      errorClass.prototype.constructor = errorClass;

      errorClass.prototype.toString = function () {
        if (this.message === undefined) {
          return this.name;
        } else {
          return this.name + ": " + this.message;
        }
      };

      return errorClass;
    }

    var InternalError = undefined;

    function throwInternalError(message) {
      throw new InternalError(message);
    }

    function whenDependentTypesAreResolved(myTypes, dependentTypes, getTypeConverters) {
      myTypes.forEach(function (type) {
        typeDependencies[type] = dependentTypes;
      });

      function onComplete(typeConverters) {
        var myTypeConverters = getTypeConverters(typeConverters);

        if (myTypeConverters.length !== myTypes.length) {
          throwInternalError("Mismatched type converter count");
        }

        for (var i = 0; i < myTypes.length; ++i) {
          registerType(myTypes[i], myTypeConverters[i]);
        }
      }

      var typeConverters = new Array(dependentTypes.length);
      var unregisteredTypes = [];
      var registered = 0;
      dependentTypes.forEach(function (dt, i) {
        if (registeredTypes.hasOwnProperty(dt)) {
          typeConverters[i] = registeredTypes[dt];
        } else {
          unregisteredTypes.push(dt);

          if (!awaitingDependencies.hasOwnProperty(dt)) {
            awaitingDependencies[dt] = [];
          }

          awaitingDependencies[dt].push(function () {
            typeConverters[i] = registeredTypes[dt];
            ++registered;

            if (registered === unregisteredTypes.length) {
              onComplete(typeConverters);
            }
          });
        }
      });

      if (0 === unregisteredTypes.length) {
        onComplete(typeConverters);
      }
    }

    function __embind_finalize_value_object(structType) {
      var reg = structRegistrations[structType];
      delete structRegistrations[structType];
      var rawConstructor = reg.rawConstructor;
      var rawDestructor = reg.rawDestructor;
      var fieldRecords = reg.fields;
      var fieldTypes = fieldRecords.map(function (field) {
        return field.getterReturnType;
      }).concat(fieldRecords.map(function (field) {
        return field.setterArgumentType;
      }));
      whenDependentTypesAreResolved([structType], fieldTypes, function (fieldTypes) {
        var fields = {};
        fieldRecords.forEach(function (field, i) {
          var fieldName = field.fieldName;
          var getterReturnType = fieldTypes[i];
          var getter = field.getter;
          var getterContext = field.getterContext;
          var setterArgumentType = fieldTypes[i + fieldRecords.length];
          var setter = field.setter;
          var setterContext = field.setterContext;
          fields[fieldName] = {
            read: function read(ptr) {
              return getterReturnType["fromWireType"](getter(getterContext, ptr));
            },
            write: function write(ptr, o) {
              var destructors = [];
              setter(setterContext, ptr, setterArgumentType["toWireType"](destructors, o));
              runDestructors(destructors);
            }
          };
        });
        return [{
          name: reg.name,
          "fromWireType": function fromWireType(ptr) {
            var rv = {};

            for (var i in fields) {
              rv[i] = fields[i].read(ptr);
            }

            rawDestructor(ptr);
            return rv;
          },
          "toWireType": function toWireType(destructors, o) {
            for (var fieldName in fields) {
              if (!(fieldName in o)) {
                throw new TypeError("Missing field");
              }
            }

            var ptr = rawConstructor();

            for (fieldName in fields) {
              fields[fieldName].write(ptr, o[fieldName]);
            }

            if (destructors !== null) {
              destructors.push(rawDestructor, ptr);
            }

            return ptr;
          },
          "argPackAdvance": 8,
          "readValueFromPointer": simpleReadValueFromPointer,
          destructorFunction: rawDestructor
        }];
      });
    }

    function getShiftFromSize(size) {
      switch (size) {
        case 1:
          return 0;

        case 2:
          return 1;

        case 4:
          return 2;

        case 8:
          return 3;

        default:
          throw new TypeError("Unknown type size: " + size);
      }
    }

    function embind_init_charCodes() {
      var codes = new Array(256);

      for (var i = 0; i < 256; ++i) {
        codes[i] = String.fromCharCode(i);
      }

      embind_charCodes = codes;
    }

    var embind_charCodes = undefined;

    function readLatin1String(ptr) {
      var ret = "";
      var c = ptr;

      while (HEAPU8[c]) {
        ret += embind_charCodes[HEAPU8[c++]];
      }

      return ret;
    }

    var BindingError = undefined;

    function throwBindingError(message) {
      throw new BindingError(message);
    }

    function registerType(rawType, registeredInstance, options) {
      options = options || {};

      if (!("argPackAdvance" in registeredInstance)) {
        throw new TypeError("registerType registeredInstance requires argPackAdvance");
      }

      var name = registeredInstance.name;

      if (!rawType) {
        throwBindingError('type "' + name + '" must have a positive integer typeid pointer');
      }

      if (registeredTypes.hasOwnProperty(rawType)) {
        if (options.ignoreDuplicateRegistrations) {
          return;
        } else {
          throwBindingError("Cannot register type '" + name + "' twice");
        }
      }

      registeredTypes[rawType] = registeredInstance;
      delete typeDependencies[rawType];

      if (awaitingDependencies.hasOwnProperty(rawType)) {
        var callbacks = awaitingDependencies[rawType];
        delete awaitingDependencies[rawType];
        callbacks.forEach(function (cb) {
          cb();
        });
      }
    }

    function __embind_register_bool(rawType, name, size, trueValue, falseValue) {
      var shift = getShiftFromSize(size);
      name = readLatin1String(name);
      registerType(rawType, {
        name: name,
        "fromWireType": function fromWireType(wt) {
          return !!wt;
        },
        "toWireType": function toWireType(destructors, o) {
          return o ? trueValue : falseValue;
        },
        "argPackAdvance": 8,
        "readValueFromPointer": function readValueFromPointer(pointer) {
          var heap;

          if (size === 1) {
            heap = HEAP8;
          } else if (size === 2) {
            heap = HEAP16;
          } else if (size === 4) {
            heap = HEAP32;
          } else {
            throw new TypeError("Unknown boolean type size: " + name);
          }

          return this["fromWireType"](heap[pointer >> shift]);
        },
        destructorFunction: null
      });
    }

    function ClassHandle_isAliasOf(other) {
      if (!(this instanceof ClassHandle)) {
        return false;
      }

      if (!(other instanceof ClassHandle)) {
        return false;
      }

      var leftClass = this.$$.ptrType.registeredClass;
      var left = this.$$.ptr;
      var rightClass = other.$$.ptrType.registeredClass;
      var right = other.$$.ptr;

      while (leftClass.baseClass) {
        left = leftClass.upcast(left);
        leftClass = leftClass.baseClass;
      }

      while (rightClass.baseClass) {
        right = rightClass.upcast(right);
        rightClass = rightClass.baseClass;
      }

      return leftClass === rightClass && left === right;
    }

    function shallowCopyInternalPointer(o) {
      return {
        count: o.count,
        deleteScheduled: o.deleteScheduled,
        preservePointerOnDelete: o.preservePointerOnDelete,
        ptr: o.ptr,
        ptrType: o.ptrType,
        smartPtr: o.smartPtr,
        smartPtrType: o.smartPtrType
      };
    }

    function throwInstanceAlreadyDeleted(obj) {
      function getInstanceTypeName(handle) {
        return handle.$$.ptrType.registeredClass.name;
      }

      throwBindingError(getInstanceTypeName(obj) + " instance already deleted");
    }

    function ClassHandle_clone() {
      if (!this.$$.ptr) {
        throwInstanceAlreadyDeleted(this);
      }

      if (this.$$.preservePointerOnDelete) {
        this.$$.count.value += 1;
        return this;
      } else {
        var clone = Object.create(Object.getPrototypeOf(this), {
          $$: {
            value: shallowCopyInternalPointer(this.$$)
          }
        });
        clone.$$.count.value += 1;
        clone.$$.deleteScheduled = false;
        return clone;
      }
    }

    function runDestructor(handle) {
      var $$ = handle.$$;

      if ($$.smartPtr) {
        $$.smartPtrType.rawDestructor($$.smartPtr);
      } else {
        $$.ptrType.registeredClass.rawDestructor($$.ptr);
      }
    }

    function ClassHandle_delete() {
      if (!this.$$.ptr) {
        throwInstanceAlreadyDeleted(this);
      }

      if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
        throwBindingError("Object already scheduled for deletion");
      }

      this.$$.count.value -= 1;
      var toDelete = 0 === this.$$.count.value;

      if (toDelete) {
        runDestructor(this);
      }

      if (!this.$$.preservePointerOnDelete) {
        this.$$.smartPtr = undefined;
        this.$$.ptr = undefined;
      }
    }

    function ClassHandle_isDeleted() {
      return !this.$$.ptr;
    }

    var delayFunction = undefined;
    var deletionQueue = [];

    function flushPendingDeletes() {
      while (deletionQueue.length) {
        var obj = deletionQueue.pop();
        obj.$$.deleteScheduled = false;
        obj["delete"]();
      }
    }

    function ClassHandle_deleteLater() {
      if (!this.$$.ptr) {
        throwInstanceAlreadyDeleted(this);
      }

      if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
        throwBindingError("Object already scheduled for deletion");
      }

      deletionQueue.push(this);

      if (deletionQueue.length === 1 && delayFunction) {
        delayFunction(flushPendingDeletes);
      }

      this.$$.deleteScheduled = true;
      return this;
    }

    function init_ClassHandle() {
      ClassHandle.prototype["isAliasOf"] = ClassHandle_isAliasOf;
      ClassHandle.prototype["clone"] = ClassHandle_clone;
      ClassHandle.prototype["delete"] = ClassHandle_delete;
      ClassHandle.prototype["isDeleted"] = ClassHandle_isDeleted;
      ClassHandle.prototype["deleteLater"] = ClassHandle_deleteLater;
    }

    function ClassHandle() {}

    var registeredPointers = {};

    function ensureOverloadTable(proto, methodName, humanName) {
      if (undefined === proto[methodName].overloadTable) {
        var prevFunc = proto[methodName];

        proto[methodName] = function () {
          if (!proto[methodName].overloadTable.hasOwnProperty(arguments.length)) {
            throwBindingError("Function '" + humanName + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + proto[methodName].overloadTable + ")!");
          }

          return proto[methodName].overloadTable[arguments.length].apply(this, arguments);
        };

        proto[methodName].overloadTable = [];
        proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
      }
    }

    function exposePublicSymbol(name, value, numArguments) {
      if (Module.hasOwnProperty(name)) {
        if (undefined === numArguments || undefined !== Module[name].overloadTable && undefined !== Module[name].overloadTable[numArguments]) {
          throwBindingError("Cannot register public name '" + name + "' twice");
        }

        ensureOverloadTable(Module, name, name);

        if (Module.hasOwnProperty(numArguments)) {
          throwBindingError("Cannot register multiple overloads of a function with the same number of arguments (" + numArguments + ")!");
        }

        Module[name].overloadTable[numArguments] = value;
      } else {
        Module[name] = value;

        if (undefined !== numArguments) {
          Module[name].numArguments = numArguments;
        }
      }
    }

    function RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast) {
      this.name = name;
      this.constructor = constructor;
      this.instancePrototype = instancePrototype;
      this.rawDestructor = rawDestructor;
      this.baseClass = baseClass;
      this.getActualType = getActualType;
      this.upcast = upcast;
      this.downcast = downcast;
      this.pureVirtualFunctions = [];
    }

    function upcastPointer(ptr, ptrClass, desiredClass) {
      while (ptrClass !== desiredClass) {
        if (!ptrClass.upcast) {
          throwBindingError("Expected null or instance of " + desiredClass.name + ", got an instance of " + ptrClass.name);
        }

        ptr = ptrClass.upcast(ptr);
        ptrClass = ptrClass.baseClass;
      }

      return ptr;
    }

    function constNoSmartPtrRawPointerToWireType(destructors, handle) {
      if (handle === null) {
        if (this.isReference) {
          throwBindingError("null is not a valid " + this.name);
        }

        return 0;
      }

      if (!handle.$$) {
        throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name);
      }

      if (!handle.$$.ptr) {
        throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
      }

      var handleClass = handle.$$.ptrType.registeredClass;
      var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
      return ptr;
    }

    function genericPointerToWireType(destructors, handle) {
      var ptr;

      if (handle === null) {
        if (this.isReference) {
          throwBindingError("null is not a valid " + this.name);
        }

        if (this.isSmartPointer) {
          ptr = this.rawConstructor();

          if (destructors !== null) {
            destructors.push(this.rawDestructor, ptr);
          }

          return ptr;
        } else {
          return 0;
        }
      }

      if (!handle.$$) {
        throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name);
      }

      if (!handle.$$.ptr) {
        throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
      }

      if (!this.isConst && handle.$$.ptrType.isConst) {
        throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name);
      }

      var handleClass = handle.$$.ptrType.registeredClass;
      ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);

      if (this.isSmartPointer) {
        if (undefined === handle.$$.smartPtr) {
          throwBindingError("Passing raw pointer to smart pointer is illegal");
        }

        switch (this.sharingPolicy) {
          case 0:
            if (handle.$$.smartPtrType === this) {
              ptr = handle.$$.smartPtr;
            } else {
              throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name);
            }

            break;

          case 1:
            ptr = handle.$$.smartPtr;
            break;

          case 2:
            if (handle.$$.smartPtrType === this) {
              ptr = handle.$$.smartPtr;
            } else {
              var clonedHandle = handle["clone"]();
              ptr = this.rawShare(ptr, __emval_register(function () {
                clonedHandle["delete"]();
              }));

              if (destructors !== null) {
                destructors.push(this.rawDestructor, ptr);
              }
            }

            break;

          default:
            throwBindingError("Unsupporting sharing policy");
        }
      }

      return ptr;
    }

    function nonConstNoSmartPtrRawPointerToWireType(destructors, handle) {
      if (handle === null) {
        if (this.isReference) {
          throwBindingError("null is not a valid " + this.name);
        }

        return 0;
      }

      if (!handle.$$) {
        throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name);
      }

      if (!handle.$$.ptr) {
        throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
      }

      if (handle.$$.ptrType.isConst) {
        throwBindingError("Cannot convert argument of type " + handle.$$.ptrType.name + " to parameter type " + this.name);
      }

      var handleClass = handle.$$.ptrType.registeredClass;
      var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
      return ptr;
    }

    function RegisteredPointer_getPointee(ptr) {
      if (this.rawGetPointee) {
        ptr = this.rawGetPointee(ptr);
      }

      return ptr;
    }

    function RegisteredPointer_destructor(ptr) {
      if (this.rawDestructor) {
        this.rawDestructor(ptr);
      }
    }

    function RegisteredPointer_deleteObject(handle) {
      if (handle !== null) {
        handle["delete"]();
      }
    }

    function downcastPointer(ptr, ptrClass, desiredClass) {
      if (ptrClass === desiredClass) {
        return ptr;
      }

      if (undefined === desiredClass.baseClass) {
        return null;
      }

      var rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass);

      if (rv === null) {
        return null;
      }

      return desiredClass.downcast(rv);
    }

    function getInheritedInstanceCount() {
      return Object.keys(registeredInstances).length;
    }

    function getLiveInheritedInstances() {
      var rv = [];

      for (var k in registeredInstances) {
        if (registeredInstances.hasOwnProperty(k)) {
          rv.push(registeredInstances[k]);
        }
      }

      return rv;
    }

    function setDelayFunction(fn) {
      delayFunction = fn;

      if (deletionQueue.length && delayFunction) {
        delayFunction(flushPendingDeletes);
      }
    }

    function init_embind() {
      Module["getInheritedInstanceCount"] = getInheritedInstanceCount;
      Module["getLiveInheritedInstances"] = getLiveInheritedInstances;
      Module["flushPendingDeletes"] = flushPendingDeletes;
      Module["setDelayFunction"] = setDelayFunction;
    }

    var registeredInstances = {};

    function getBasestPointer(class_, ptr) {
      if (ptr === undefined) {
        throwBindingError("ptr should not be undefined");
      }

      while (class_.baseClass) {
        ptr = class_.upcast(ptr);
        class_ = class_.baseClass;
      }

      return ptr;
    }

    function getInheritedInstance(class_, ptr) {
      ptr = getBasestPointer(class_, ptr);
      return registeredInstances[ptr];
    }

    function makeClassHandle(prototype, record) {
      if (!record.ptrType || !record.ptr) {
        throwInternalError("makeClassHandle requires ptr and ptrType");
      }

      var hasSmartPtrType = !!record.smartPtrType;
      var hasSmartPtr = !!record.smartPtr;

      if (hasSmartPtrType !== hasSmartPtr) {
        throwInternalError("Both smartPtrType and smartPtr must be specified");
      }

      record.count = {
        value: 1
      };
      return Object.create(prototype, {
        $$: {
          value: record
        }
      });
    }

    function RegisteredPointer_fromWireType(ptr) {
      var rawPointer = this.getPointee(ptr);

      if (!rawPointer) {
        this.destructor(ptr);
        return null;
      }

      var registeredInstance = getInheritedInstance(this.registeredClass, rawPointer);

      if (undefined !== registeredInstance) {
        if (0 === registeredInstance.$$.count.value) {
          registeredInstance.$$.ptr = rawPointer;
          registeredInstance.$$.smartPtr = ptr;
          return registeredInstance["clone"]();
        } else {
          var rv = registeredInstance["clone"]();
          this.destructor(ptr);
          return rv;
        }
      }

      function makeDefaultHandle() {
        if (this.isSmartPointer) {
          return makeClassHandle(this.registeredClass.instancePrototype, {
            ptrType: this.pointeeType,
            ptr: rawPointer,
            smartPtrType: this,
            smartPtr: ptr
          });
        } else {
          return makeClassHandle(this.registeredClass.instancePrototype, {
            ptrType: this,
            ptr: ptr
          });
        }
      }

      var actualType = this.registeredClass.getActualType(rawPointer);
      var registeredPointerRecord = registeredPointers[actualType];

      if (!registeredPointerRecord) {
        return makeDefaultHandle.call(this);
      }

      var toType;

      if (this.isConst) {
        toType = registeredPointerRecord.constPointerType;
      } else {
        toType = registeredPointerRecord.pointerType;
      }

      var dp = downcastPointer(rawPointer, this.registeredClass, toType.registeredClass);

      if (dp === null) {
        return makeDefaultHandle.call(this);
      }

      if (this.isSmartPointer) {
        return makeClassHandle(toType.registeredClass.instancePrototype, {
          ptrType: toType,
          ptr: dp,
          smartPtrType: this,
          smartPtr: ptr
        });
      } else {
        return makeClassHandle(toType.registeredClass.instancePrototype, {
          ptrType: toType,
          ptr: dp
        });
      }
    }

    function init_RegisteredPointer() {
      RegisteredPointer.prototype.getPointee = RegisteredPointer_getPointee;
      RegisteredPointer.prototype.destructor = RegisteredPointer_destructor;
      RegisteredPointer.prototype["argPackAdvance"] = 8;
      RegisteredPointer.prototype["readValueFromPointer"] = simpleReadValueFromPointer;
      RegisteredPointer.prototype["deleteObject"] = RegisteredPointer_deleteObject;
      RegisteredPointer.prototype["fromWireType"] = RegisteredPointer_fromWireType;
    }

    function RegisteredPointer(name, registeredClass, isReference, isConst, isSmartPointer, pointeeType, sharingPolicy, rawGetPointee, rawConstructor, rawShare, rawDestructor) {
      this.name = name;
      this.registeredClass = registeredClass;
      this.isReference = isReference;
      this.isConst = isConst;
      this.isSmartPointer = isSmartPointer;
      this.pointeeType = pointeeType;
      this.sharingPolicy = sharingPolicy;
      this.rawGetPointee = rawGetPointee;
      this.rawConstructor = rawConstructor;
      this.rawShare = rawShare;
      this.rawDestructor = rawDestructor;

      if (!isSmartPointer && registeredClass.baseClass === undefined) {
        if (isConst) {
          this["toWireType"] = constNoSmartPtrRawPointerToWireType;
          this.destructorFunction = null;
        } else {
          this["toWireType"] = nonConstNoSmartPtrRawPointerToWireType;
          this.destructorFunction = null;
        }
      } else {
        this["toWireType"] = genericPointerToWireType;
      }
    }

    function replacePublicSymbol(name, value, numArguments) {
      if (!Module.hasOwnProperty(name)) {
        throwInternalError("Replacing nonexistant public symbol");
      }

      if (undefined !== Module[name].overloadTable && undefined !== numArguments) {
        Module[name].overloadTable[numArguments] = value;
      } else {
        Module[name] = value;
        Module[name].argCount = numArguments;
      }
    }

    function embind__requireFunction(signature, rawFunction) {
      signature = readLatin1String(signature);

      function makeDynCaller(dynCall) {
        var args = [];

        for (var i = 1; i < signature.length; ++i) {
          args.push("a" + i);
        }

        var name = "dynCall_" + signature + "_" + rawFunction;
        var body = "return function " + name + "(" + args.join(", ") + ") {\n";
        body += "    return dynCall(rawFunction" + (args.length ? ", " : "") + args.join(", ") + ");\n";
        body += "};\n";
        return new Function("dynCall", "rawFunction", body)(dynCall, rawFunction);
      }

      var fp;

      if (Module["FUNCTION_TABLE_" + signature] !== undefined) {
        fp = Module["FUNCTION_TABLE_" + signature][rawFunction];
      } else if (typeof FUNCTION_TABLE !== "undefined") {
        fp = FUNCTION_TABLE[rawFunction];
      } else {
        var dc = Module["dynCall_" + signature];

        if (dc === undefined) {
          dc = Module["dynCall_" + signature.replace(/f/g, "d")];

          if (dc === undefined) {
            throwBindingError("No dynCall invoker for signature: " + signature);
          }
        }

        fp = makeDynCaller(dc);
      }

      if (typeof fp !== "function") {
        throwBindingError("unknown function pointer with signature " + signature + ": " + rawFunction);
      }

      return fp;
    }

    var UnboundTypeError = undefined;

    function getTypeName(type) {
      var ptr = ___getTypeName(type);

      var rv = readLatin1String(ptr);

      _free(ptr);

      return rv;
    }

    function throwUnboundTypeError(message, types) {
      var unboundTypes = [];
      var seen = {};

      function visit(type) {
        if (seen[type]) {
          return;
        }

        if (registeredTypes[type]) {
          return;
        }

        if (typeDependencies[type]) {
          typeDependencies[type].forEach(visit);
          return;
        }

        unboundTypes.push(type);
        seen[type] = true;
      }

      types.forEach(visit);
      throw new UnboundTypeError(message + ": " + unboundTypes.map(getTypeName).join([", "]));
    }

    function __embind_register_class(rawType, rawPointerType, rawConstPointerType, baseClassRawType, getActualTypeSignature, getActualType, upcastSignature, upcast, downcastSignature, downcast, name, destructorSignature, rawDestructor) {
      name = readLatin1String(name);
      getActualType = embind__requireFunction(getActualTypeSignature, getActualType);

      if (upcast) {
        upcast = embind__requireFunction(upcastSignature, upcast);
      }

      if (downcast) {
        downcast = embind__requireFunction(downcastSignature, downcast);
      }

      rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
      var legalFunctionName = makeLegalFunctionName(name);
      exposePublicSymbol(legalFunctionName, function () {
        throwUnboundTypeError("Cannot construct " + name + " due to unbound types", [baseClassRawType]);
      });
      whenDependentTypesAreResolved([rawType, rawPointerType, rawConstPointerType], baseClassRawType ? [baseClassRawType] : [], function (base) {
        base = base[0];
        var baseClass;
        var basePrototype;

        if (baseClassRawType) {
          baseClass = base.registeredClass;
          basePrototype = baseClass.instancePrototype;
        } else {
          basePrototype = ClassHandle.prototype;
        }

        var constructor = createNamedFunction(legalFunctionName, function () {
          if (Object.getPrototypeOf(this) !== instancePrototype) {
            throw new BindingError("Use 'new' to construct " + name);
          }

          if (undefined === registeredClass.constructor_body) {
            throw new BindingError(name + " has no accessible constructor");
          }

          var body = registeredClass.constructor_body[arguments.length];

          if (undefined === body) {
            throw new BindingError("Tried to invoke ctor of " + name + " with invalid number of parameters (" + arguments.length + ") - expected (" + Object.keys(registeredClass.constructor_body).toString() + ") parameters instead!");
          }

          return body.apply(this, arguments);
        });
        var instancePrototype = Object.create(basePrototype, {
          constructor: {
            value: constructor
          }
        });
        constructor.prototype = instancePrototype;
        var registeredClass = new RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast);
        var referenceConverter = new RegisteredPointer(name, registeredClass, true, false, false);
        var pointerConverter = new RegisteredPointer(name + "*", registeredClass, false, false, false);
        var constPointerConverter = new RegisteredPointer(name + " const*", registeredClass, false, true, false);
        registeredPointers[rawType] = {
          pointerType: pointerConverter,
          constPointerType: constPointerConverter
        };
        replacePublicSymbol(legalFunctionName, constructor);
        return [referenceConverter, pointerConverter, constPointerConverter];
      });
    }

    function heap32VectorToArray(count, firstElement) {
      var array = [];

      for (var i = 0; i < count; i++) {
        array.push(HEAP32[(firstElement >> 2) + i]);
      }

      return array;
    }

    function __embind_register_class_constructor(rawClassType, argCount, rawArgTypesAddr, invokerSignature, invoker, rawConstructor) {
      var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      invoker = embind__requireFunction(invokerSignature, invoker);
      whenDependentTypesAreResolved([], [rawClassType], function (classType) {
        classType = classType[0];
        var humanName = "constructor " + classType.name;

        if (undefined === classType.registeredClass.constructor_body) {
          classType.registeredClass.constructor_body = [];
        }

        if (undefined !== classType.registeredClass.constructor_body[argCount - 1]) {
          throw new BindingError("Cannot register multiple constructors with identical number of parameters (" + (argCount - 1) + ") for class '" + classType.name + "'! Overload resolution is currently only performed using the parameter count, not actual type info!");
        }

        classType.registeredClass.constructor_body[argCount - 1] = function unboundTypeHandler() {
          throwUnboundTypeError("Cannot construct " + classType.name + " due to unbound types", rawArgTypes);
        };

        whenDependentTypesAreResolved([], rawArgTypes, function (argTypes) {
          classType.registeredClass.constructor_body[argCount - 1] = function constructor_body() {
            if (arguments.length !== argCount - 1) {
              throwBindingError(humanName + " called with " + arguments.length + " arguments, expected " + (argCount - 1));
            }

            var destructors = [];
            var args = new Array(argCount);
            args[0] = rawConstructor;

            for (var i = 1; i < argCount; ++i) {
              args[i] = argTypes[i]["toWireType"](destructors, arguments[i - 1]);
            }

            var ptr = invoker.apply(null, args);
            runDestructors(destructors);
            return argTypes[0]["fromWireType"](ptr);
          };

          return [];
        });
        return [];
      });
    }

    function new_(constructor, argumentList) {
      if (!(constructor instanceof Function)) {
        throw new TypeError("new_ called with constructor type " + _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default()(constructor) + " which is not a function");
      }

      var dummy = createNamedFunction(constructor.name || "unknownFunctionName", function () {});
      dummy.prototype = constructor.prototype;
      var obj = new dummy();
      var r = constructor.apply(obj, argumentList);
      return r instanceof Object ? r : obj;
    }

    function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc) {
      var argCount = argTypes.length;

      if (argCount < 2) {
        throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!");
      }

      var isClassMethodFunc = argTypes[1] !== null && classType !== null;
      var needsDestructorStack = false;

      for (var i = 1; i < argTypes.length; ++i) {
        if (argTypes[i] !== null && argTypes[i].destructorFunction === undefined) {
          needsDestructorStack = true;
          break;
        }
      }

      var returns = argTypes[0].name !== "void";
      var argsList = "";
      var argsListWired = "";

      for (var i = 0; i < argCount - 2; ++i) {
        argsList += (i !== 0 ? ", " : "") + "arg" + i;
        argsListWired += (i !== 0 ? ", " : "") + "arg" + i + "Wired";
      }

      var invokerFnBody = "return function " + makeLegalFunctionName(humanName) + "(" + argsList + ") {\n" + "if (arguments.length !== " + (argCount - 2) + ") {\n" + "throwBindingError('function " + humanName + " called with ' + arguments.length + ' arguments, expected " + (argCount - 2) + " args!');\n" + "}\n";

      if (needsDestructorStack) {
        invokerFnBody += "var destructors = [];\n";
      }

      var dtorStack = needsDestructorStack ? "destructors" : "null";
      var args1 = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"];
      var args2 = [throwBindingError, cppInvokerFunc, cppTargetFunc, runDestructors, argTypes[0], argTypes[1]];

      if (isClassMethodFunc) {
        invokerFnBody += "var thisWired = classParam.toWireType(" + dtorStack + ", this);\n";
      }

      for (var i = 0; i < argCount - 2; ++i) {
        invokerFnBody += "var arg" + i + "Wired = argType" + i + ".toWireType(" + dtorStack + ", arg" + i + "); // " + argTypes[i + 2].name + "\n";
        args1.push("argType" + i);
        args2.push(argTypes[i + 2]);
      }

      if (isClassMethodFunc) {
        argsListWired = "thisWired" + (argsListWired.length > 0 ? ", " : "") + argsListWired;
      }

      invokerFnBody += (returns ? "var rv = " : "") + "invoker(fn" + (argsListWired.length > 0 ? ", " : "") + argsListWired + ");\n";

      if (needsDestructorStack) {
        invokerFnBody += "runDestructors(destructors);\n";
      } else {
        for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
          var paramName = i === 1 ? "thisWired" : "arg" + (i - 2) + "Wired";

          if (argTypes[i].destructorFunction !== null) {
            invokerFnBody += paramName + "_dtor(" + paramName + "); // " + argTypes[i].name + "\n";
            args1.push(paramName + "_dtor");
            args2.push(argTypes[i].destructorFunction);
          }
        }
      }

      if (returns) {
        invokerFnBody += "var ret = retType.fromWireType(rv);\n" + "return ret;\n";
      } else {}

      invokerFnBody += "}\n";
      args1.push(invokerFnBody);
      var invokerFunction = new_(Function, args1).apply(null, args2);
      return invokerFunction;
    }

    function __embind_register_class_function(rawClassType, methodName, argCount, rawArgTypesAddr, invokerSignature, rawInvoker, context, isPureVirtual) {
      var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      methodName = readLatin1String(methodName);
      rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);
      whenDependentTypesAreResolved([], [rawClassType], function (classType) {
        classType = classType[0];
        var humanName = classType.name + "." + methodName;

        if (isPureVirtual) {
          classType.registeredClass.pureVirtualFunctions.push(methodName);
        }

        function unboundTypesHandler() {
          throwUnboundTypeError("Cannot call " + humanName + " due to unbound types", rawArgTypes);
        }

        var proto = classType.registeredClass.instancePrototype;
        var method = proto[methodName];

        if (undefined === method || undefined === method.overloadTable && method.className !== classType.name && method.argCount === argCount - 2) {
          unboundTypesHandler.argCount = argCount - 2;
          unboundTypesHandler.className = classType.name;
          proto[methodName] = unboundTypesHandler;
        } else {
          ensureOverloadTable(proto, methodName, humanName);
          proto[methodName].overloadTable[argCount - 2] = unboundTypesHandler;
        }

        whenDependentTypesAreResolved([], rawArgTypes, function (argTypes) {
          var memberFunction = craftInvokerFunction(humanName, argTypes, classType, rawInvoker, context);

          if (undefined === proto[methodName].overloadTable) {
            memberFunction.argCount = argCount - 2;
            proto[methodName] = memberFunction;
          } else {
            proto[methodName].overloadTable[argCount - 2] = memberFunction;
          }

          return [];
        });
        return [];
      });
    }

    var emval_free_list = [];
    var emval_handle_array = [{}, {
      value: undefined
    }, {
      value: null
    }, {
      value: true
    }, {
      value: false
    }];

    function __emval_decref(handle) {
      if (handle > 4 && 0 === --emval_handle_array[handle].refcount) {
        emval_handle_array[handle] = undefined;
        emval_free_list.push(handle);
      }
    }

    function count_emval_handles() {
      var count = 0;

      for (var i = 5; i < emval_handle_array.length; ++i) {
        if (emval_handle_array[i] !== undefined) {
          ++count;
        }
      }

      return count;
    }

    function get_first_emval() {
      for (var i = 5; i < emval_handle_array.length; ++i) {
        if (emval_handle_array[i] !== undefined) {
          return emval_handle_array[i];
        }
      }

      return null;
    }

    function init_emval() {
      Module["count_emval_handles"] = count_emval_handles;
      Module["get_first_emval"] = get_first_emval;
    }

    function __emval_register(value) {
      switch (value) {
        case undefined:
          {
            return 1;
          }

        case null:
          {
            return 2;
          }

        case true:
          {
            return 3;
          }

        case false:
          {
            return 4;
          }

        default:
          {
            var handle = emval_free_list.length ? emval_free_list.pop() : emval_handle_array.length;
            emval_handle_array[handle] = {
              refcount: 1,
              value: value
            };
            return handle;
          }
      }
    }

    function __embind_register_emval(rawType, name) {
      name = readLatin1String(name);
      registerType(rawType, {
        name: name,
        "fromWireType": function fromWireType(handle) {
          var rv = emval_handle_array[handle].value;

          __emval_decref(handle);

          return rv;
        },
        "toWireType": function toWireType(destructors, value) {
          return __emval_register(value);
        },
        "argPackAdvance": 8,
        "readValueFromPointer": simpleReadValueFromPointer,
        destructorFunction: null
      });
    }

    function _embind_repr(v) {
      if (v === null) {
        return "null";
      }

      var t = _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default()(v);

      if (t === "object" || t === "array" || t === "function") {
        return v.toString();
      } else {
        return "" + v;
      }
    }

    function floatReadValueFromPointer(name, shift) {
      switch (shift) {
        case 2:
          return function (pointer) {
            return this["fromWireType"](HEAPF32[pointer >> 2]);
          };

        case 3:
          return function (pointer) {
            return this["fromWireType"](HEAPF64[pointer >> 3]);
          };

        default:
          throw new TypeError("Unknown float type: " + name);
      }
    }

    function __embind_register_float(rawType, name, size) {
      var shift = getShiftFromSize(size);
      name = readLatin1String(name);
      registerType(rawType, {
        name: name,
        "fromWireType": function fromWireType(value) {
          return value;
        },
        "toWireType": function toWireType(destructors, value) {
          if (typeof value !== "number" && typeof value !== "boolean") {
            throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name);
          }

          return value;
        },
        "argPackAdvance": 8,
        "readValueFromPointer": floatReadValueFromPointer(name, shift),
        destructorFunction: null
      });
    }

    function __embind_register_function(name, argCount, rawArgTypesAddr, signature, rawInvoker, fn) {
      var argTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      name = readLatin1String(name);
      rawInvoker = embind__requireFunction(signature, rawInvoker);
      exposePublicSymbol(name, function () {
        throwUnboundTypeError("Cannot call " + name + " due to unbound types", argTypes);
      }, argCount - 1);
      whenDependentTypesAreResolved([], argTypes, function (argTypes) {
        var invokerArgsArray = [argTypes[0], null].concat(argTypes.slice(1));
        replacePublicSymbol(name, craftInvokerFunction(name, invokerArgsArray, null, rawInvoker, fn), argCount - 1);
        return [];
      });
    }

    function integerReadValueFromPointer(name, shift, signed) {
      switch (shift) {
        case 0:
          return signed ? function readS8FromPointer(pointer) {
            return HEAP8[pointer];
          } : function readU8FromPointer(pointer) {
            return HEAPU8[pointer];
          };

        case 1:
          return signed ? function readS16FromPointer(pointer) {
            return HEAP16[pointer >> 1];
          } : function readU16FromPointer(pointer) {
            return HEAPU16[pointer >> 1];
          };

        case 2:
          return signed ? function readS32FromPointer(pointer) {
            return HEAP32[pointer >> 2];
          } : function readU32FromPointer(pointer) {
            return HEAPU32[pointer >> 2];
          };

        default:
          throw new TypeError("Unknown integer type: " + name);
      }
    }

    function __embind_register_integer(primitiveType, name, size, minRange, maxRange) {
      name = readLatin1String(name);

      if (maxRange === -1) {
        maxRange = 4294967295;
      }

      var shift = getShiftFromSize(size);

      var fromWireType = function fromWireType(value) {
        return value;
      };

      if (minRange === 0) {
        var bitshift = 32 - 8 * size;

        fromWireType = function fromWireType(value) {
          return value << bitshift >>> bitshift;
        };
      }

      var isUnsignedType = name.indexOf("unsigned") != -1;
      registerType(primitiveType, {
        name: name,
        "fromWireType": fromWireType,
        "toWireType": function toWireType(destructors, value) {
          if (typeof value !== "number" && typeof value !== "boolean") {
            throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name);
          }

          if (value < minRange || value > maxRange) {
            throw new TypeError('Passing a number "' + _embind_repr(value) + '" from JS side to C/C++ side to an argument of type "' + name + '", which is outside the valid range [' + minRange + ", " + maxRange + "]!");
          }

          return isUnsignedType ? value >>> 0 : value | 0;
        },
        "argPackAdvance": 8,
        "readValueFromPointer": integerReadValueFromPointer(name, shift, minRange !== 0),
        destructorFunction: null
      });
    }

    function __embind_register_memory_view(rawType, dataTypeIndex, name) {
      var typeMapping = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array];
      var TA = typeMapping[dataTypeIndex];

      function decodeMemoryView(handle) {
        handle = handle >> 2;
        var heap = HEAPU32;
        var size = heap[handle];
        var data = heap[handle + 1];
        return new TA(heap["buffer"], data, size);
      }

      name = readLatin1String(name);
      registerType(rawType, {
        name: name,
        "fromWireType": decodeMemoryView,
        "argPackAdvance": 8,
        "readValueFromPointer": decodeMemoryView
      }, {
        ignoreDuplicateRegistrations: true
      });
    }

    function __embind_register_std_string(rawType, name) {
      name = readLatin1String(name);
      var stdStringIsUTF8 = name === "std::string";
      registerType(rawType, {
        name: name,
        "fromWireType": function fromWireType(value) {
          var length = HEAPU32[value >> 2];
          var str;

          if (stdStringIsUTF8) {
            var endChar = HEAPU8[value + 4 + length];
            var endCharSwap = 0;

            if (endChar != 0) {
              endCharSwap = endChar;
              HEAPU8[value + 4 + length] = 0;
            }

            var decodeStartPtr = value + 4;

            for (var i = 0; i <= length; ++i) {
              var currentBytePtr = value + 4 + i;

              if (HEAPU8[currentBytePtr] == 0) {
                var stringSegment = UTF8ToString(decodeStartPtr);
                if (str === undefined) str = stringSegment;else {
                  str += String.fromCharCode(0);
                  str += stringSegment;
                }
                decodeStartPtr = currentBytePtr + 1;
              }
            }

            if (endCharSwap != 0) HEAPU8[value + 4 + length] = endCharSwap;
          } else {
            var a = new Array(length);

            for (var i = 0; i < length; ++i) {
              a[i] = String.fromCharCode(HEAPU8[value + 4 + i]);
            }

            str = a.join("");
          }

          _free(value);

          return str;
        },
        "toWireType": function toWireType(destructors, value) {
          if (value instanceof ArrayBuffer) {
            value = new Uint8Array(value);
          }

          var getLength;
          var valueIsOfTypeString = typeof value === "string";

          if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) {
            throwBindingError("Cannot pass non-string to std::string");
          }

          if (stdStringIsUTF8 && valueIsOfTypeString) {
            getLength = function getLength() {
              return lengthBytesUTF8(value);
            };
          } else {
            getLength = function getLength() {
              return value.length;
            };
          }

          var length = getLength();

          var ptr = _malloc(4 + length + 1);

          HEAPU32[ptr >> 2] = length;

          if (stdStringIsUTF8 && valueIsOfTypeString) {
            stringToUTF8(value, ptr + 4, length + 1);
          } else {
            if (valueIsOfTypeString) {
              for (var i = 0; i < length; ++i) {
                var charCode = value.charCodeAt(i);

                if (charCode > 255) {
                  _free(ptr);

                  throwBindingError("String has UTF-16 code units that do not fit in 8 bits");
                }

                HEAPU8[ptr + 4 + i] = charCode;
              }
            } else {
              for (var i = 0; i < length; ++i) {
                HEAPU8[ptr + 4 + i] = value[i];
              }
            }
          }

          if (destructors !== null) {
            destructors.push(_free, ptr);
          }

          return ptr;
        },
        "argPackAdvance": 8,
        "readValueFromPointer": simpleReadValueFromPointer,
        destructorFunction: function destructorFunction(ptr) {
          _free(ptr);
        }
      });
    }

    function __embind_register_std_wstring(rawType, charSize, name) {
      name = readLatin1String(name);
      var getHeap, shift;

      if (charSize === 2) {
        getHeap = function getHeap() {
          return HEAPU16;
        };

        shift = 1;
      } else if (charSize === 4) {
        getHeap = function getHeap() {
          return HEAPU32;
        };

        shift = 2;
      }

      registerType(rawType, {
        name: name,
        "fromWireType": function fromWireType(value) {
          var HEAP = getHeap();
          var length = HEAPU32[value >> 2];
          var a = new Array(length);
          var start = value + 4 >> shift;

          for (var i = 0; i < length; ++i) {
            a[i] = String.fromCharCode(HEAP[start + i]);
          }

          _free(value);

          return a.join("");
        },
        "toWireType": function toWireType(destructors, value) {
          var HEAP = getHeap();
          var length = value.length;

          var ptr = _malloc(4 + length * charSize);

          HEAPU32[ptr >> 2] = length;
          var start = ptr + 4 >> shift;

          for (var i = 0; i < length; ++i) {
            HEAP[start + i] = value.charCodeAt(i);
          }

          if (destructors !== null) {
            destructors.push(_free, ptr);
          }

          return ptr;
        },
        "argPackAdvance": 8,
        "readValueFromPointer": simpleReadValueFromPointer,
        destructorFunction: function destructorFunction(ptr) {
          _free(ptr);
        }
      });
    }

    function __embind_register_value_object(rawType, name, constructorSignature, rawConstructor, destructorSignature, rawDestructor) {
      structRegistrations[rawType] = {
        name: readLatin1String(name),
        rawConstructor: embind__requireFunction(constructorSignature, rawConstructor),
        rawDestructor: embind__requireFunction(destructorSignature, rawDestructor),
        fields: []
      };
    }

    function __embind_register_value_object_field(structType, fieldName, getterReturnType, getterSignature, getter, getterContext, setterArgumentType, setterSignature, setter, setterContext) {
      structRegistrations[structType].fields.push({
        fieldName: readLatin1String(fieldName),
        getterReturnType: getterReturnType,
        getter: embind__requireFunction(getterSignature, getter),
        getterContext: getterContext,
        setterArgumentType: setterArgumentType,
        setter: embind__requireFunction(setterSignature, setter),
        setterContext: setterContext
      });
    }

    function __embind_register_void(rawType, name) {
      name = readLatin1String(name);
      registerType(rawType, {
        isVoid: true,
        name: name,
        "argPackAdvance": 0,
        "fromWireType": function fromWireType() {
          return undefined;
        },
        "toWireType": function toWireType(destructors, o) {
          return undefined;
        }
      });
    }

    function __emval_incref(handle) {
      if (handle > 4) {
        emval_handle_array[handle].refcount += 1;
      }
    }

    function requireRegisteredType(rawType, humanName) {
      var impl = registeredTypes[rawType];

      if (undefined === impl) {
        throwBindingError(humanName + " has unknown type " + getTypeName(rawType));
      }

      return impl;
    }

    function __emval_take_value(type, argv) {
      type = requireRegisteredType(type, "_emval_take_value");
      var v = type["readValueFromPointer"](argv);
      return __emval_register(v);
    }

    function _abort() {
      Module["abort"]();
    }

    function _emscripten_get_heap_size() {
      return HEAP8.length;
    }

    function abortOnCannotGrowMemory(requestedSize) {
      abort("OOM");
    }

    function _emscripten_resize_heap(requestedSize) {
      abortOnCannotGrowMemory(requestedSize);
    }

    function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.set(HEAPU8.subarray(src, src + num), dest);
    }

    function ___setErrNo(value) {
      if (Module["___errno_location"]) HEAP32[Module["___errno_location"]() >> 2] = value;
      return value;
    }

    InternalError = Module["InternalError"] = extendError(Error, "InternalError");
    embind_init_charCodes();
    BindingError = Module["BindingError"] = extendError(Error, "BindingError");
    init_ClassHandle();
    init_RegisteredPointer();
    init_embind();
    UnboundTypeError = Module["UnboundTypeError"] = extendError(Error, "UnboundTypeError");
    init_emval();
    var asmGlobalArg = {};
    var asmLibraryArg = {
      "b": abort,
      "u": setTempRet0,
      "p": ___cxa_allocate_exception,
      "l": ___cxa_throw,
      "i": ___setErrNo,
      "t": ___syscall140,
      "h": ___syscall146,
      "s": ___syscall6,
      "r": __embind_finalize_value_object,
      "q": __embind_register_bool,
      "g": __embind_register_class,
      "o": __embind_register_class_constructor,
      "d": __embind_register_class_function,
      "F": __embind_register_emval,
      "n": __embind_register_float,
      "E": __embind_register_function,
      "e": __embind_register_integer,
      "c": __embind_register_memory_view,
      "m": __embind_register_std_string,
      "D": __embind_register_std_wstring,
      "C": __embind_register_value_object,
      "k": __embind_register_value_object_field,
      "B": __embind_register_void,
      "A": __emval_decref,
      "z": __emval_incref,
      "j": __emval_take_value,
      "f": _abort,
      "y": _emscripten_get_heap_size,
      "x": _emscripten_memcpy_big,
      "w": _emscripten_resize_heap,
      "v": abortOnCannotGrowMemory,
      "a": DYNAMICTOP_PTR
    };
    var asm = Module["asm"](asmGlobalArg, asmLibraryArg, buffer);
    Module["asm"] = asm;

    var ___errno_location = Module["___errno_location"] = function () {
      return Module["asm"]["G"].apply(null, arguments);
    };

    var ___getTypeName = Module["___getTypeName"] = function () {
      return Module["asm"]["H"].apply(null, arguments);
    };

    var _free = Module["_free"] = function () {
      return Module["asm"]["I"].apply(null, arguments);
    };

    var _malloc = Module["_malloc"] = function () {
      return Module["asm"]["J"].apply(null, arguments);
    };

    var globalCtors = Module["globalCtors"] = function () {
      return Module["asm"]["ca"].apply(null, arguments);
    };

    var dynCall_dii = Module["dynCall_dii"] = function () {
      return Module["asm"]["K"].apply(null, arguments);
    };

    var dynCall_i = Module["dynCall_i"] = function () {
      return Module["asm"]["L"].apply(null, arguments);
    };

    var dynCall_ii = Module["dynCall_ii"] = function () {
      return Module["asm"]["M"].apply(null, arguments);
    };

    var dynCall_iidiiii = Module["dynCall_iidiiii"] = function () {
      return Module["asm"]["N"].apply(null, arguments);
    };

    var dynCall_iii = Module["dynCall_iii"] = function () {
      return Module["asm"]["O"].apply(null, arguments);
    };

    var dynCall_iiii = Module["dynCall_iiii"] = function () {
      return Module["asm"]["P"].apply(null, arguments);
    };

    var dynCall_iiiid = Module["dynCall_iiiid"] = function () {
      return Module["asm"]["Q"].apply(null, arguments);
    };

    var dynCall_iiiii = Module["dynCall_iiiii"] = function () {
      return Module["asm"]["R"].apply(null, arguments);
    };

    var dynCall_iiiiiiiiiidd = Module["dynCall_iiiiiiiiiidd"] = function () {
      return Module["asm"]["S"].apply(null, arguments);
    };

    var dynCall_jiji = Module["dynCall_jiji"] = function () {
      return Module["asm"]["T"].apply(null, arguments);
    };

    var dynCall_v = Module["dynCall_v"] = function () {
      return Module["asm"]["U"].apply(null, arguments);
    };

    var dynCall_vi = Module["dynCall_vi"] = function () {
      return Module["asm"]["V"].apply(null, arguments);
    };

    var dynCall_vii = Module["dynCall_vii"] = function () {
      return Module["asm"]["W"].apply(null, arguments);
    };

    var dynCall_viid = Module["dynCall_viid"] = function () {
      return Module["asm"]["X"].apply(null, arguments);
    };

    var dynCall_viii = Module["dynCall_viii"] = function () {
      return Module["asm"]["Y"].apply(null, arguments);
    };

    var dynCall_viiid = Module["dynCall_viiid"] = function () {
      return Module["asm"]["Z"].apply(null, arguments);
    };

    var dynCall_viiii = Module["dynCall_viiii"] = function () {
      return Module["asm"]["_"].apply(null, arguments);
    };

    var dynCall_viiiii = Module["dynCall_viiiii"] = function () {
      return Module["asm"]["$"].apply(null, arguments);
    };

    var dynCall_viiiiii = Module["dynCall_viiiiii"] = function () {
      return Module["asm"]["aa"].apply(null, arguments);
    };

    var dynCall_viiiiiiiiidd = Module["dynCall_viiiiiiiiidd"] = function () {
      return Module["asm"]["ba"].apply(null, arguments);
    };

    Module["asm"] = asm;

    Module["then"] = function (func) {
      if (Module["calledRun"]) {
        func(Module);
      } else {
        var old = Module["onRuntimeInitialized"];

        Module["onRuntimeInitialized"] = function () {
          if (old) old();
          func(Module);
        };
      }

      return Module;
    };

    function ExitStatus(status) {
      this.name = "ExitStatus";
      this.message = "Program terminated with exit(" + status + ")";
      this.status = status;
    }

    ExitStatus.prototype = new Error();
    ExitStatus.prototype.constructor = ExitStatus;

    dependenciesFulfilled = function runCaller() {
      if (!Module["calledRun"]) run();
      if (!Module["calledRun"]) dependenciesFulfilled = runCaller;
    };

    function run(args) {
      args = args || Module["arguments"];

      if (runDependencies > 0) {
        return;
      }

      preRun();
      if (runDependencies > 0) return;
      if (Module["calledRun"]) return;

      function doRun() {
        if (Module["calledRun"]) return;
        Module["calledRun"] = true;
        if (ABORT) return;
        ensureInitRuntime();
        preMain();
        if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
        postRun();
      }

      if (Module["setStatus"]) {
        Module["setStatus"]("Running...");
        setTimeout(function () {
          setTimeout(function () {
            Module["setStatus"]("");
          }, 1);
          doRun();
        }, 1);
      } else {
        doRun();
      }
    }

    Module["run"] = run;

    function abort(what) {
      if (Module["onAbort"]) {
        Module["onAbort"](what);
      }

      if (what !== undefined) {
        out(what);
        err(what);
        what = JSON.stringify(what);
      } else {
        what = "";
      }

      ABORT = true;
      EXITSTATUS = 1;
      throw "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
    }

    Module["abort"] = abort;

    if (Module["preInit"]) {
      if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];

      while (Module["preInit"].length > 0) {
        Module["preInit"].pop()();
      }
    }

    Module["noExitRuntime"] = true;
    run();
    return mvtdstpack;
  };
}();

/* harmony default export */ __webpack_exports__["a"] = (mvtdstpack);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(20), "/"))

/***/ }),
/* 11 */
/***/ (function(module, exports) {

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }
}

module.exports = _arrayWithoutHoles;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

module.exports = _iterableToArray;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

module.exports = _nonIterableSpread;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;

/***/ }),
/* 15 */
/***/ (function(module, exports) {

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;

/***/ }),
/* 16 */
/***/ (function(module, exports) {

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

module.exports = _nonIterableRest;

/***/ }),
/* 17 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 18 */
/***/ (function(module, exports) {

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;

/***/ }),
/* 19 */
/***/ (function(module, exports) {

function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;

/***/ }),
/* 20 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var stats_namespaceObject = {};
__webpack_require__.r(stats_namespaceObject);
__webpack_require__.d(stats_namespaceObject, "_AggregationTest", function() { return stats_AggregationTest; });
__webpack_require__.d(stats_namespaceObject, "_get_conditional_dist", function() { return get_conditional_dist; });
__webpack_require__.d(stats_namespaceObject, "SkatTest", function() { return stats_SkatTest; });
__webpack_require__.d(stats_namespaceObject, "SkatOptimalTest", function() { return stats_SkatOptimalTest; });
__webpack_require__.d(stats_namespaceObject, "ZegginiBurdenTest", function() { return stats_ZegginiBurdenTest; });
__webpack_require__.d(stats_namespaceObject, "VTTest", function() { return stats_VTTest; });
__webpack_require__.d(stats_namespaceObject, "MVT_WASM_HELPERS", function() { return MVT_WASM_HELPERS; });
__webpack_require__.d(stats_namespaceObject, "calculate_mvt_pvalue", function() { return calculate_mvt_pvalue; });
__webpack_require__.d(stats_namespaceObject, "_skatDavies", function() { return _skatDavies; });
__webpack_require__.d(stats_namespaceObject, "_skatLiu", function() { return _skatLiu; });
var helpers_namespaceObject = {};
__webpack_require__.r(helpers_namespaceObject);
__webpack_require__.d(helpers_namespaceObject, "_PortalVariantsHelper", function() { return helpers_PortalVariantsHelper; });
__webpack_require__.d(helpers_namespaceObject, "_PortalGroupHelper", function() { return helpers_PortalGroupHelper; });
__webpack_require__.d(helpers_namespaceObject, "parsePortalJSON", function() { return parsePortalJSON; });
__webpack_require__.d(helpers_namespaceObject, "PortalTestRunner", function() { return helpers_PortalTestRunner; });
__webpack_require__.d(helpers_namespaceObject, "AGGREGATION_TESTS", function() { return AGGREGATION_TESTS; });

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/toConsumableArray.js
var toConsumableArray = __webpack_require__(5);
var toConsumableArray_default = /*#__PURE__*/__webpack_require__.n(toConsumableArray);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/slicedToArray.js
var slicedToArray = __webpack_require__(1);
var slicedToArray_default = /*#__PURE__*/__webpack_require__.n(slicedToArray);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/classCallCheck.js
var classCallCheck = __webpack_require__(2);
var classCallCheck_default = /*#__PURE__*/__webpack_require__.n(classCallCheck);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/createClass.js
var createClass = __webpack_require__(3);
var createClass_default = /*#__PURE__*/__webpack_require__.n(createClass);

// EXTERNAL MODULE: ./node_modules/numeric/numeric-1.2.6.js
var numeric_1_2_6 = __webpack_require__(0);
var numeric_1_2_6_default = /*#__PURE__*/__webpack_require__.n(numeric_1_2_6);

// CONCATENATED MODULE: ./src/app/constants.js
var REGEX_EPACTS = new RegExp("(?:chr)?(.+):(\\d+)_?(\\w+)?/?([^_]+)?_?(.*)?");
var REGEX_REGION = new RegExp("(?:chr)?(.+):(\\d+)-(\\d+)");

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js
var possibleConstructorReturn = __webpack_require__(6);
var possibleConstructorReturn_default = /*#__PURE__*/__webpack_require__.n(possibleConstructorReturn);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/getPrototypeOf.js
var getPrototypeOf = __webpack_require__(7);
var getPrototypeOf_default = /*#__PURE__*/__webpack_require__.n(getPrototypeOf);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/inherits.js
var inherits = __webpack_require__(8);
var inherits_default = /*#__PURE__*/__webpack_require__.n(inherits);

// CONCATENATED MODULE: ./src/app/linalg.js

/**
 * Return the cholesky decomposition A = GG'. The matrix G is returned.
 * @param A
 * @return {*}
 */

function cholesky(A) {
  var n = A.length;
  var G = numeric_1_2_6_default.a.rep([n, n], 0);

  for (var i = 0; i < n; i++) {
    for (var j = 0; j <= i; j++) {
      var s = A[j][i];

      for (var k = 0; k <= j - 1; k++) {
        s = s - G[j][k] * G[i][k];
      }

      if (j < i) {
        G[i][j] = s / G[j][j];
      } else {
        G[i][i] = Math.sqrt(s);
      }
    }
  }

  return G;
}
// EXTERNAL MODULE: ./src/app/mvtdstpack.js
var mvtdstpack = __webpack_require__(10);

// CONCATENATED MODULE: ./src/app/qfc.js


/**
 * A port of Robert Davies' method for computing the distribution
 * of a linear combination of chi-squared random variables.
 *
 * <p>
 *
 * Publication: 
 * {@link https://www.jstor.org/stable/2346911|The distribution of a linear combination of chi‐squared random variables. Applied Statistics 29 323‐333.}
 *
 * <p>
 *
 * Original C code:
 * {@link http://www.robertnz.net/QF.htm}
 *
 * @module qfc
 * @license MIT
 */
var pi = Math.PI;
var log28 = 0.0866;
var count = 0;
var sigsq, lmax, lmin, qfc_mean, qfc_c, intl, ersm, qfc_r, lim, ndtsrt, fail, qfc_n, th, lb, nc;

function exp1(x) {
  return x < -50.0 ? 0.0 : Math.exp(x);
}

function counter() {
  count += 1;

  if (count > lim) {
    throw new RangeError("Exceeded limit of " + lim + " calls");
  }
}

function square(x) {
  return x * x;
}

function cube(x) {
  return x * x * x;
}

function log1(x, first) {
  if (Math.abs(x) > 0.1) {
    return first ? Math.log(1.0 + x) : Math.log(1.0 + x) - x;
  } else {
    var s, s1, term, y, k;
    y = x / (2.0 + x);
    term = 2.0 * cube(y);
    k = 3.0;
    s = (first ? 2.0 : -x) * y;
    y = square(y);

    for (s1 = s + term / k; s1 !== s; s1 = s + term / k) {
      k = k + 2.0;
      term = term * y;
      s = s1;
    }

    return s;
  }
}

function order() {
  var j, k;

  outer: for (var _j = 0; _j < qfc_r; _j++) {
    var lj = Math.abs(lb[_j]);

    for (var _k = _j - 1; _k >= 0; _k--) {
      if (lj > Math.abs(lb[th[_k]])) {
        th[_k + 1] = th[_k];
      } else {
        th[_k + 1] = _j;
        continue outer;
      }
    }

    k = -1;
    th[k + 1] = _j;
  }

  ndtsrt = false;
}

function errbd(u) {
  var sum1, lj, ncj, x, y, xconst, j, nj;
  counter();
  xconst = u * sigsq;
  sum1 = u * xconst;
  u = 2.0 * u;

  for (j = qfc_r - 1; j >= 0; j--) {
    nj = qfc_n[j];
    lj = lb[j];
    ncj = nc[j];
    x = u * lj;
    y = 1.0 - x;
    xconst = xconst + lj * (ncj / y + nj) / y;
    sum1 = sum1 + ncj * square(x / y) + nj * (square(x) / y + log1(-x, false));
  }

  return [exp1(-0.5 * sum1), xconst];
}

function ctff(accx, u2) {
  var u1, u, rb, xconst, c1, c2, rerr;
  u1 = 0.0;
  c1 = qfc_mean;
  rb = 2.0 * (u2 > 0.0 ? lmax : lmin);

  function calc_err(u) {
    var _errbd = errbd(u);

    var _errbd2 = slicedToArray_default()(_errbd, 2);

    rerr = _errbd2[0];
    c2 = _errbd2[1];
    return rerr;
  }

  for (u = u2 / (1.0 + u2 * rb); calc_err(u) > accx; u = u2 / (1.0 + u2 * rb)) {
    u1 = u2;
    c1 = c2;
    u2 = 2.0 * u2;
  }

  for (u = (c1 - qfc_mean) / (c2 - qfc_mean); u < 0.9; u = (c1 - qfc_mean) / (c2 - qfc_mean)) {
    u = (u1 + u2) / 2.0;

    var _errbd3 = errbd(u / (1.0 + u * rb));

    var _errbd4 = slicedToArray_default()(_errbd3, 2);

    rerr = _errbd4[0];
    xconst = _errbd4[1];

    if (rerr > accx) {
      u1 = u;
      c1 = xconst;
    } else {
      u2 = u;
      c2 = xconst;
    }
  }

  return [c2, u2];
}

function truncation(u, tausq) {
  var sum1, sum2, prod1, prod2, prod3, lj, ncj, x, y, err1, err2;
  var j, nj, s;
  counter();
  sum1 = 0.0;
  prod2 = 0.0;
  prod3 = 0.0;
  s = 0;
  sum2 = (sigsq + tausq) * square(u);
  prod1 = 2.0 * sum2;
  u = 2.0 * u;

  for (j = 0; j < qfc_r; j++) {
    lj = lb[j];
    ncj = nc[j];
    nj = qfc_n[j];
    x = square(u * lj);
    sum1 = sum1 + ncj * x / (1.0 + x);

    if (x > 1.0) {
      prod2 = prod2 + nj * Math.log(x);
      prod3 = prod3 + nj * log1(x, true);
      s = s + nj;
    } else {
      prod1 = prod1 + nj * log1(x, true);
    }
  }

  sum1 = 0.5 * sum1;
  prod2 = prod1 + prod2;
  prod3 = prod1 + prod3;
  x = exp1(-sum1 - 0.25 * prod2) / pi;
  y = exp1(-sum1 - 0.25 * prod3) / pi;
  err1 = s == 0 ? 1.0 : x * 2.0 / s;
  err2 = prod3 > 1.0 ? 2.5 * y : 1.0;

  if (err2 < err1) {
    err1 = err2;
  }

  x = 0.5 * sum2;
  err2 = x <= y ? 1.0 : y / x;
  return err1 < err2 ? err1 : err2;
}

function findu(ut, accx) {
  var u, i;
  var divis = [2.0, 1.4, 1.2, 1.1];
  u = ut / 4.0;

  if (truncation(u, 0.0) > accx) {
    for (u = ut; truncation(u, 0.0) > accx; u = ut) {
      ut = ut * 4.0;
    }
  } else {
    ut = u;

    for (u = u / 4.0; truncation(u, 0.0) <= accx; u = u / 4.0) {
      ut = u;
    }
  }

  for (i = 0; i < 4; i++) {
    u = ut / divis[i];

    if (truncation(u, 0.0) <= accx) {
      ut = u;
    }
  }

  return ut;
}

function integrate(nterm, interv, tausq, mainx) {
  var inpi, u, sum1, sum2, sum3, x, y, z;
  var k, j, nj;
  inpi = interv / pi;

  for (k = nterm; k >= 0; k--) {
    u = (k + 0.5) * interv;
    sum1 = -2.0 * u * qfc_c;
    sum2 = Math.abs(sum1);
    sum3 = -0.5 * sigsq * square(u);

    for (j = qfc_r - 1; j >= 0; j--) {
      nj = qfc_n[j];
      x = 2.0 * lb[j] * u;
      y = square(x);
      sum3 = sum3 - 0.25 * nj * log1(y, true);
      y = nc[j] * x / (1.0 + y);
      z = nj * Math.atan(x) + y;
      sum1 = sum1 + z;
      sum2 = sum2 + Math.abs(z);
      sum3 = sum3 - 0.5 * x * y;
    }

    x = inpi * exp1(sum3) / u;

    if (!mainx) {
      x = x * (1.0 - exp1(-0.5 * tausq * square(u)));
    }

    sum1 = Math.sin(0.5 * sum1) * x;
    sum2 = 0.5 * sum2 * x;
    intl = intl + sum1;
    ersm = ersm + sum2;
  }
}

function cfe(x) {
  var axl, axl1, axl2, sxl, sum1, lj;
  var j, k, t;
  counter();
  if (ndtsrt) order();
  axl = Math.abs(x);
  sxl = x > 0.0 ? 1.0 : -1.0;
  sum1 = 0.0;

  for (j = qfc_r - 1; j >= 0; j--) {
    t = th[j];

    if (lb[t] * sxl > 0.0) {
      lj = Math.abs(lb[t]);
      axl1 = axl - lj * (qfc_n[t] + nc[t]);
      axl2 = lj / log28;

      if (axl1 > axl2) {
        axl = axl1;
      } else {
        if (axl1 > axl2) axl = axl2;
        sum1 = (axl - axl1) / lj;

        for (k = j - 1; k >= 0; k--) {
          sum1 = sum1 + (qfc_n[th[k]] + nc[th[k]]);
        }

        break;
      }
    }
  }

  if (sum1 > 100.0) {
    fail = true;
    return 1.0;
  } else {
    return Math.pow(2.0, sum1 / 4.0) / (pi * square(axl));
  }
}
/**
 * Mixture chi-square distribution function. <p>
 *
 * This is the cumulative distribution for a linear mixture of chi-squared random variables, each having
 * its own degrees of freedom and non-centrality parameter: <p>
 *
 * c1 = sum(lb1[j] * x_j) + sigma * X0, where each x_j is non-central chi-squared, and X0 is a standard normal variable.
 *
 * @param lb1 {number[]} Coefficient of each chi-squared variable.
 * @param nc1 {number[]} Non-centrality parameter for each chi-squared variable x_j.
 * @param n1 {number[]} Degrees of freedom for each chi-squared variable x_j.
 * @param r1 {number} Number of chi-squared variables.
 * @param sigma {number} Coefficient of standard normal variable.
 * @param c1 {number[]} Mixture chi-squared statistic value (point at which function should be evaluated).
 * @param lim1 {number} Maximum number of terms in integrations.
 * @param acc {number} Maximum error.
 * @return {number} Cumulative lower-tail probability.
 */


function qf(lb1, nc1, n1, r1, sigma, c1, lim1, acc) {
  /*  distribution function of a linear combination of non-central
      chi-squared random variables :
  
      input:
      lb[j]            coefficient of j-th chi-squared variable
      nc[j]            non-centrality parameter
      n[j]             degrees of freedom
      j = 0, 2 ... r-1
      sigma            coefficient of standard normal variable
      c                point at which df is to be evaluated
      lim              maximum number of terms in integration
      acc              maximum error
  
      output:
      ifault = 1       required accuracy NOT achieved
      2       round-off error possibly significant
      3       invalid parameters
      4       unable to locate integration parameters
      5       out of memory
  
      trace[0]         absolute sum
      trace[1]         total number of integration terms
      trace[2]         number of integrations
      trace[3]         integration interval in final integration
      trace[4]         truncation point in initial integration
      trace[5]         s.d. of initial convergence factor
      trace[6]         cycles to locate integration parameters     */
  var j, nj, nt, ntm;
  var acc1, almx, xlim, xnt, xntm;
  var utx, tausq, sd, intv, intv1, x, up, un, d1, d2, lj, ncj;
  var qfval, ifault;
  var trace = new Array(7).fill(0.0);
  var rats = [1, 2, 4, 8];

  function done() {
    trace[6] = count;
    return [qfval, ifault, trace];
  }

  count = 0;
  qfc_r = r1;
  lim = lim1;
  qfc_c = c1;
  qfc_n = n1;
  lb = lb1;
  nc = nc1;
  ifault = 0;
  intl = 0.0;
  ersm = 0.0;
  qfval = -1.0;
  acc1 = acc;
  ndtsrt = true;
  fail = false;
  xlim = lim;
  th = new Array(qfc_r).fill(NaN);
  /* find mean, sd, max and min of lb,
     check that parameter values are valid */

  sigsq = square(sigma);
  sd = sigsq;
  lmax = 0.0;
  lmin = 0.0;
  qfc_mean = 0.0;

  for (j = 0; j < qfc_r; j++) {
    nj = qfc_n[j];
    lj = lb[j];
    ncj = nc[j];

    if (nj < 0 || ncj < 0.0) {
      ifault = 3;
      return done();
    }

    sd = sd + square(lj) * (2 * nj + 4.0 * ncj);
    qfc_mean = qfc_mean + lj * (nj + ncj);
    if (lmax < lj) lmax = lj;else if (lmin > lj) lmin = lj;
  }

  if (sd == 0.0) {
    qfval = qfc_c > 0.0 ? 1.0 : 0.0;
    return done();
  }

  if (lmin == 0.0 && lmax == 0.0 && sigma == 0.0) {
    ifault = 3;
    return done();
  }

  sd = Math.sqrt(sd);
  almx = lmax < -lmin ? -lmin : lmax;
  /* starting values for findu, ctff */

  utx = 16.0 / sd;
  up = 4.5 / sd;
  un = -up;

  try {
    var l1 = function l1() {
      var _ctff = ctff(acc1, up);

      var _ctff2 = slicedToArray_default()(_ctff, 2);

      ctffx = _ctff2[0];
      up = _ctff2[1];
      d1 = ctffx - qfc_c;

      if (d1 < 0.0) {
        qfval = 1.0;
        return done();
      }

      var _ctff3 = ctff(acc1, un);

      var _ctff4 = slicedToArray_default()(_ctff3, 2);

      ctffx = _ctff4[0];
      un = _ctff4[1];
      d2 = qfc_c - ctffx;

      if (d2 < 0.0) {
        qfval = 0.0;
        return done();
      }
      /* find integration interval */


      intv = 2.0 * pi / (d1 > d2 ? d1 : d2);
      /* calculate number of terms required for main and
         auxillary integrations */

      xnt = utx / intv;
      xntm = 3.0 / Math.sqrt(acc1);

      if (xnt > xntm * 1.5) {
        /* parameters for auxillary integration */
        if (xntm > xlim) {
          ifault = 1;
          return done();
        }

        ntm = Math.floor(xntm + 0.5);
        intv1 = utx / ntm;
        x = 2.0 * pi / intv1;
        if (x <= Math.abs(qfc_c)) return l2();
        /* calculate convergence factor */

        tausq = .33 * acc1 / (1.1 * (cfe(qfc_c - x) + cfe(qfc_c + x)));
        if (fail) return l2();
        acc1 = .67 * acc1;
        /* auxillary integration */

        integrate(ntm, intv1, tausq, false);
        xlim = xlim - xntm;
        sigsq = sigsq + tausq;
        trace[2] = trace[2] + 1;
        trace[1] = trace[1] + ntm + 1;
        /* find truncation point with new convergence factor */

        utx = findu(utx, .25 * acc1);
        acc1 = 0.75 * acc1;
        return l1();
      }

      return l2();
    };
    /* main integration */


    var l2 = function l2() {
      trace[3] = intv;

      if (xnt > xlim) {
        ifault = 1;
        return done();
      }

      nt = Math.floor(xnt + 0.5);
      integrate(nt, intv, 0.0, true);
      trace[2] = trace[2] + 1;
      trace[1] = trace[1] + nt + 1;
      qfval = 0.5 - intl;
      trace[0] = ersm;
      /* test whether round-off error could be significant
         allow for radix 8 or 16 machines */

      up = ersm;
      x = up + acc / 10.0;

      for (j = 0; j < 4; j++) {
        if (rats[j] * x === rats[j] * up) ifault = 2;
      }

      return done();
    };

    /* truncation point with no convergence factor */
    utx = findu(utx, 0.5 * acc1);
    /* does convergence factor help */

    if (qfc_c != 0.0 && almx > 0.07 * sd) {
      tausq = .25 * acc1 / cfe(qfc_c);
      if (fail) fail = false;else if (truncation(utx, tausq) < .2 * acc1) {
        sigsq = sigsq + tausq;
        utx = findu(utx, 0.25 * acc1);
        trace[5] = Math.sqrt(tausq);
      }
    }

    trace[4] = utx;
    acc1 = 0.5 * acc1;
    /* find RANGE of distribution, quit if outside this */

    var ctffx;
    return l1();
  } catch (error) {
    if (error.name === "RangeError") {
      ifault = 4;
      return done();
    } else {
      throw error;
    }
  }
}


// CONCATENATED MODULE: ./src/app/quadrature.js



var GAUSS_KRONROD_ABSCISSA = {
  21: [0.00000000000000000000000000000000000e+00, 1.48874338981631210884826001129719985e-01, 2.94392862701460198131126603103865566e-01, 4.33395394129247190799265943165784162e-01, 5.62757134668604683339000099272694141e-01, 6.79409568299024406234327365114873576e-01, 7.80817726586416897063717578345042377e-01, 8.65063366688984510732096688423493049e-01, 9.30157491355708226001207180059508346e-01, 9.73906528517171720077964012084452053e-01, 9.95657163025808080735527280689002848e-01],
  31: [0.00000000000000000000000000000000000e+00, 1.01142066918717499027074231447392339e-01, 2.01194093997434522300628303394596208e-01, 2.99180007153168812166780024266388963e-01, 3.94151347077563369897207370981045468e-01, 4.85081863640239680693655740232350613e-01, 5.70972172608538847537226737253910641e-01, 6.50996741297416970533735895313274693e-01, 7.24417731360170047416186054613938010e-01, 7.90418501442465932967649294817947347e-01, 8.48206583410427216200648320774216851e-01, 8.97264532344081900882509656454495883e-01, 9.37273392400705904307758947710209471e-01, 9.67739075679139134257347978784337225e-01, 9.87992518020485428489565718586612581e-01, 9.98002298693397060285172840152271209e-01],
  61: [0.00000000000000000000000000000000000e+00, 5.14718425553176958330252131667225737e-02, 1.02806937966737030147096751318000592e-01, 1.53869913608583546963794672743255920e-01, 2.04525116682309891438957671002024710e-01, 2.54636926167889846439805129817805108e-01, 3.04073202273625077372677107199256554e-01, 3.52704725530878113471037207089373861e-01, 4.00401254830394392535476211542660634e-01, 4.47033769538089176780609900322854000e-01, 4.92480467861778574993693061207708796e-01, 5.36624148142019899264169793311072794e-01, 5.79345235826361691756024932172540496e-01, 6.20526182989242861140477556431189299e-01, 6.60061064126626961370053668149270753e-01, 6.97850494793315796932292388026640068e-01, 7.33790062453226804726171131369527646e-01, 7.67777432104826194917977340974503132e-01, 7.99727835821839083013668942322683241e-01, 8.29565762382768397442898119732501916e-01, 8.57205233546061098958658510658943857e-01, 8.82560535792052681543116462530225590e-01, 9.05573307699907798546522558925958320e-01, 9.26200047429274325879324277080474004e-01, 9.44374444748559979415831324037439122e-01, 9.60021864968307512216871025581797663e-01, 9.73116322501126268374693868423706885e-01, 9.83668123279747209970032581605662802e-01, 9.91630996870404594858628366109485725e-01, 9.96893484074649540271630050918695283e-01, 9.99484410050490637571325895705810819e-01]
};
var GAUSS_KRONROD_WEIGHTS = {
  21: [1.49445554002916905664936468389821204e-01, 1.47739104901338491374841515972068046e-01, 1.42775938577060080797094273138717061e-01, 1.34709217311473325928054001771706833e-01, 1.23491976262065851077958109831074160e-01, 1.09387158802297641899210590325804960e-01, 9.31254545836976055350654650833663444e-02, 7.50396748109199527670431409161900094e-02, 5.47558965743519960313813002445801764e-02, 3.25581623079647274788189724593897606e-02, 1.16946388673718742780643960621920484e-02],
  31: [1.01330007014791549017374792767492547e-01, 1.00769845523875595044946662617569722e-01, 9.91735987217919593323931734846031311e-02, 9.66427269836236785051799076275893351e-02, 9.31265981708253212254868727473457186e-02, 8.85644430562117706472754436937743032e-02, 8.30805028231330210382892472861037896e-02, 7.68496807577203788944327774826590067e-02, 6.98541213187282587095200770991474758e-02, 6.20095678006706402851392309608029322e-02, 5.34815246909280872653431472394302968e-02, 4.45897513247648766082272993732796902e-02, 3.53463607913758462220379484783600481e-02, 2.54608473267153201868740010196533594e-02, 1.50079473293161225383747630758072681e-02, 5.37747987292334898779205143012764982e-03],
  61: [5.14947294294515675583404336470993075e-02, 5.14261285374590259338628792157812598e-02, 5.12215478492587721706562826049442083e-02, 5.08817958987496064922974730498046919e-02, 5.04059214027823468408930856535850289e-02, 4.97956834270742063578115693799423285e-02, 4.90554345550297788875281653672381736e-02, 4.81858617570871291407794922983045926e-02, 4.71855465692991539452614781810994865e-02, 4.60592382710069881162717355593735806e-02, 4.48148001331626631923555516167232438e-02, 4.34525397013560693168317281170732581e-02, 4.19698102151642461471475412859697578e-02, 4.03745389515359591119952797524681142e-02, 3.86789456247275929503486515322810503e-02, 3.68823646518212292239110656171359677e-02, 3.49793380280600241374996707314678751e-02, 3.29814470574837260318141910168539275e-02, 3.09072575623877624728842529430922726e-02, 2.87540487650412928439787853543342111e-02, 2.65099548823331016106017093350754144e-02, 2.41911620780806013656863707252320268e-02, 2.18280358216091922971674857383389934e-02, 1.94141411939423811734089510501284559e-02, 1.69208891890532726275722894203220924e-02, 1.43697295070458048124514324435800102e-02, 1.18230152534963417422328988532505929e-02, 9.27327965951776342844114689202436042e-03, 6.63070391593129217331982636975016813e-03, 3.89046112709988405126720184451550328e-03, 1.38901369867700762455159122675969968e-03]
}; // const GAUSS_ABSCISSA = {
//   10: [
//     1.48874338981631210884826001129719985e-01,
//     4.33395394129247190799265943165784162e-01,
//     6.79409568299024406234327365114873576e-01,
//     8.65063366688984510732096688423493049e-01,
//     9.73906528517171720077964012084452053e-01
//   ],
//   15: [
//     0.00000000000000000000000000000000000e+00,
//     2.01194093997434522300628303394596208e-01,
//     3.94151347077563369897207370981045468e-01,
//     5.70972172608538847537226737253910641e-01,
//     7.24417731360170047416186054613938010e-01,
//     8.48206583410427216200648320774216851e-01,
//     9.37273392400705904307758947710209471e-01,
//     9.87992518020485428489565718586612581e-01,
//   ],
//   30: [
//     5.14718425553176958330252131667225737e-02,
//     1.53869913608583546963794672743255920e-01,
//     2.54636926167889846439805129817805108e-01,
//     3.52704725530878113471037207089373861e-01,
//     4.47033769538089176780609900322854000e-01,
//     5.36624148142019899264169793311072794e-01,
//     6.20526182989242861140477556431189299e-01,
//     6.97850494793315796932292388026640068e-01,
//     7.67777432104826194917977340974503132e-01,
//     8.29565762382768397442898119732501916e-01,
//     8.82560535792052681543116462530225590e-01,
//     9.26200047429274325879324277080474004e-01,
//     9.60021864968307512216871025581797663e-01,
//     9.83668123279747209970032581605662802e-01,
//     9.96893484074649540271630050918695283e-01,
//   ]
// };

var GAUSS_WEIGHTS = {
  10: [2.95524224714752870173892994651338329e-01, 2.69266719309996355091226921569469353e-01, 2.19086362515982043995534934228163192e-01, 1.49451349150580593145776339657697332e-01, 6.66713443086881375935688098933317929e-02],
  15: [2.02578241925561272880620199967519315e-01, 1.98431485327111576456118326443839325e-01, 1.86161000015562211026800561866422825e-01, 1.66269205816993933553200860481208811e-01, 1.39570677926154314447804794511028323e-01, 1.07159220467171935011869546685869303e-01, 7.03660474881081247092674164506673385e-02, 3.07532419961172683546283935772044177e-02],
  30: [1.02852652893558840341285636705415044e-01, 1.01762389748405504596428952168554045e-01, 9.95934205867952670627802821035694765e-02, 9.63687371746442596394686263518098651e-02, 9.21225222377861287176327070876187672e-02, 8.68997872010829798023875307151257026e-02, 8.07558952294202153546949384605297309e-02, 7.37559747377052062682438500221907342e-02, 6.59742298821804951281285151159623612e-02, 5.74931562176190664817216894020561288e-02, 4.84026728305940529029381404228075178e-02, 3.87991925696270495968019364463476920e-02, 2.87847078833233693497191796112920436e-02, 1.84664683110909591423021319120472691e-02, 7.96819249616660561546588347467362245e-03]
};
var ROOT_EPSILON = Math.sqrt(Number.EPSILON);

var quadrature_GaussKronrod =
/*#__PURE__*/
function () {
  function GaussKronrod() {
    var N = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 21;
    var maxDepth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 15;
    var maxRelativeError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ROOT_EPSILON;

    classCallCheck_default()(this, GaussKronrod);

    this.N = N;
    this.maxDepth = maxDepth;
    this.maxRelativeError = maxRelativeError;
    this.error = 0;
  }

  createClass_default()(GaussKronrod, [{
    key: "_integrateNonAdaptive",
    value: function _integrateNonAdaptive(f) {
      var N = this.N;
      var gauss_start = 2;
      var kronrod_start = 1;
      var gauss_order = (N - 1) / 2;
      var kronrod_result = 0;
      var gauss_result = 0;
      var fp, fm;

      if (gauss_order & 1) {
        fp = f(0);
        kronrod_result = fp * GAUSS_KRONROD_WEIGHTS[N][0];
        gauss_result += fp * GAUSS_WEIGHTS[(N - 1) / 2][0];
      } else {
        fp = f(0);
        kronrod_result = fp * GAUSS_KRONROD_WEIGHTS[N][0];
        gauss_start = 1;
        kronrod_start = 2;
      }

      for (var i = gauss_start; i < GAUSS_KRONROD_ABSCISSA[N].length; i += 2) {
        fp = f(GAUSS_KRONROD_ABSCISSA[N][i]);
        fm = f(-GAUSS_KRONROD_ABSCISSA[N][i]);
        kronrod_result += (fp + fm) * GAUSS_KRONROD_WEIGHTS[N][i];
        gauss_result += (fp + fm) * GAUSS_WEIGHTS[(N - 1) / 2][Math.floor(i / 2)];
      }

      for (var _i = kronrod_start; _i < GAUSS_KRONROD_ABSCISSA[N].length; _i += 2) {
        fp = f(GAUSS_KRONROD_ABSCISSA[N][_i]);
        fm = f(-GAUSS_KRONROD_ABSCISSA[N][_i]);
        kronrod_result += (fp + fm) * GAUSS_KRONROD_WEIGHTS[N][_i];
      }

      var error = Math.max(Math.abs(kronrod_result - gauss_result), Math.abs(kronrod_result * Number.EPSILON * 2));
      return [kronrod_result, error];
    }
  }, {
    key: "_recursiveAdaptiveIntegrate",
    value: function _recursiveAdaptiveIntegrate(f, a, b, max_levels, abs_tol) {
      var error_local;
      var estimate;
      var mean = (b + a) / 2;
      var scale = (b - a) / 2;

      var ff = function ff(x) {
        return f(scale * x + mean);
      };

      var _this$_integrateNonAd = this._integrateNonAdaptive(ff);

      var _this$_integrateNonAd2 = slicedToArray_default()(_this$_integrateNonAd, 2);

      estimate = _this$_integrateNonAd2[0];
      error_local = _this$_integrateNonAd2[1];
      estimate *= scale;
      var abs_tol1 = Math.abs(estimate * this.maxRelativeError);

      if (!abs_tol) {
        abs_tol = abs_tol1;
      }

      if (max_levels && abs_tol < error_local) {
        var mid = (a + b) / 2;

        var _this$_recursiveAdapt = this._recursiveAdaptiveIntegrate(f, a, mid, max_levels - 1, abs_tol / 2);

        var _this$_recursiveAdapt2 = slicedToArray_default()(_this$_recursiveAdapt, 1);

        estimate = _this$_recursiveAdapt2[0];

        var result = this._recursiveAdaptiveIntegrate(f, mid, b, max_levels - 1, abs_tol / 2);

        estimate += result[0];
        this.error += result[1];
        return [estimate, error_local];
      }

      this.error = error_local; //let dbg = `${a.toString().padEnd(15)} ${b.toString().padEnd(15)} ${max_levels.toString().padEnd(5)} ${abs_tol.toExponential(2).padEnd(11)} ${estimate.toExponential(2).padEnd(11)} ${error_local.toExponential(2).padStart(5).padEnd(11)}\n`;
      //this.stream.write(dbg);

      return [estimate, error_local];
    }
  }, {
    key: "integrate",
    value: function integrate(f, a, b) {
      var result;

      if (isFinite(a) && isFinite(b)) {
        result = this._recursiveAdaptiveIntegrate(f, a, b, this.maxDepth, 0);
      } else {
        throw new Error("Additional integration limits not implemented");
      }

      return result;
    }
  }]);

  return GaussKronrod;
}();


// CONCATENATED MODULE: ./src/app/rstats.js
/**
 * JavaScript port of Rmath functions. <p>
 *
 * These functions have been directly ported from the Rmath library, found in the R source code repository under
 * R-source/src/include/Rmath.h. Most of the code should look almost identical to the C code, with minor changes to
 * adapt to features present in C but not in JS. <p>
 *
 * Test cases were ported from R-source/tests/d-p-q-r-tests.R. We additionally wrote other test cases over a range of
 * parameter values and edge cases. These cases are found in our test suite in test/unit/rstats.js. <p>
 *
 * @module rstats
 * @author Matthew Flickinger
 * @author Ryan Welch
 * @license LGPL-2.1
 */
// Constants
var DBL_EPSILON = 2.2204460492503130808472633361816e-16;
var DBL_MIN = Number.MIN_VALUE;
var DBL_MAX_EXP = 308;
var DBL_MIN_EXP = -323;
var DBL_MAX = Number.MAX_VALUE;
var SCALE_FACTOR = 1.157920892373162e+77;
var EULERS_CONST = 0.5772156649015328606065120900824024;
var TOL_LOGCF = 1e-14;
var LGAMMA_C = 0.2273736845824652515226821577978691e-12;
var DXREL = 1.490116119384765625e-8;
var M_LN2 = Math.LN2; //0.693147180559945309417232121458;

var M_LN10 = Math.LN10; //2.302585092994045684017991454684;

var M_PI = Math.PI;
var M_2PI = 2 * M_PI;
var M_LN_2PI = Math.log(2 * Math.PI);
var M_LN_SQRT_2PI = Math.log(Math.sqrt(M_2PI));
var M_SQRT_32 = 5.656854249492380195206754896838;
var M_1_SQRT_2PI = 0.398942280401432677939946059934;
var M_CUTOFF = M_LN2 * DBL_MAX_EXP / DBL_EPSILON;

var _dbl_min_exp = M_LN2 * DBL_MIN_EXP;

var ME_DOMAIN = 1;
var ME_RANGE = 2;
var ME_NOCONV = 4;
var ME_PRECISION = 8;
var ME_UNDERFLOW = 16;

function ML_ERROR(x, s) {
  if (x > ME_DOMAIN) {
    var msg = "";

    switch (x) {
      case ME_DOMAIN:
        msg = "argument out of domain in ".concat(s);
        break;

      case ME_RANGE:
        msg = "value out of range in ".concat(s);
        break;

      case ME_NOCONV:
        msg = "convergence failed in ".concat(s);
        break;

      case ME_PRECISION:
        msg = "full precision may not have been achieved in ".concat(s);
        break;

      case ME_UNDERFLOW:
        msg = "underflow occurred in ".concat(s);
        break;
    }

    console.error(msg);
  }
}

function ML_ERR_return_NAN() {
  ML_ERROR(ME_DOMAIN, "");
  return NaN;
}

var S0 = 0.083333333333333333333;
/* 1/12 */

var S1 = 0.00277777777777777777778;
/* 1/360 */

var S2 = 0.00079365079365079365079365;
/* 1/1260 */

var S3 = 0.000595238095238095238095238;
/* 1/1680 */

var S4 = 0.0008417508417508417508417508;
/* 1/1188 */

var SFERR_HALVES = [0.0,
/* n=0 - wrong, place holder only */
0.1534264097200273452913848,
/* 0.5 */
0.0810614667953272582196702,
/* 1.0 */
0.0548141210519176538961390,
/* 1.5 */
0.0413406959554092940938221,
/* 2.0 */
0.03316287351993628748511048,
/* 2.5 */
0.02767792568499833914878929,
/* 3.0 */
0.02374616365629749597132920,
/* 3.5 */
0.02079067210376509311152277,
/* 4.0 */
0.01848845053267318523077934,
/* 4.5 */
0.01664469118982119216319487,
/* 5.0 */
0.01513497322191737887351255,
/* 5.5 */
0.01387612882307074799874573,
/* 6.0 */
0.01281046524292022692424986,
/* 6.5 */
0.01189670994589177009505572,
/* 7.0 */
0.01110455975820691732662991,
/* 7.5 */
0.010411265261972096497478567,
/* 8.0 */
0.009799416126158803298389475,
/* 8.5 */
0.009255462182712732917728637,
/* 9.0 */
0.008768700134139385462952823,
/* 9.5 */
0.008330563433362871256469318,
/* 10.0 */
0.007934114564314020547248100,
/* 10.5 */
0.007573675487951840794972024,
/* 11.0 */
0.007244554301320383179543912,
/* 11.5 */
0.006942840107209529865664152,
/* 12.0 */
0.006665247032707682442354394,
/* 12.5 */
0.006408994188004207068439631,
/* 13.0 */
0.006171712263039457647532867,
/* 13.5 */
0.005951370112758847735624416,
/* 14.0 */
0.005746216513010115682023589,
/* 14.5 */
0.005554733551962801371038690
/* 15.0 */
];
var LGAMMA_COEFS = [0.3224670334241132182362075833230126e-0, 0.6735230105319809513324605383715000e-1,
/* = (zeta(3)-1)/3 */
0.2058080842778454787900092413529198e-1, 0.7385551028673985266273097291406834e-2, 0.2890510330741523285752988298486755e-2, 0.1192753911703260977113935692828109e-2, 0.5096695247430424223356548135815582e-3, 0.2231547584535793797614188036013401e-3, 0.9945751278180853371459589003190170e-4, 0.4492623673813314170020750240635786e-4, 0.2050721277567069155316650397830591e-4, 0.9439488275268395903987425104415055e-5, 0.4374866789907487804181793223952411e-5, 0.2039215753801366236781900709670839e-5, 0.9551412130407419832857179772951265e-6, 0.4492469198764566043294290331193655e-6, 0.2120718480555466586923135901077628e-6, 0.1004322482396809960872083050053344e-6, 0.4769810169363980565760193417246730e-7, 0.2271109460894316491031998116062124e-7, 0.1083865921489695409107491757968159e-7, 0.5183475041970046655121248647057669e-8, 0.2483674543802478317185008663991718e-8, 0.1192140140586091207442548202774640e-8, 0.5731367241678862013330194857961011e-9, 0.2759522885124233145178149692816341e-9, 0.1330476437424448948149715720858008e-9, 0.6422964563838100022082448087644648e-10, 0.3104424774732227276239215783404066e-10, 0.1502138408075414217093301048780668e-10, 0.7275974480239079662504549924814047e-11, 0.3527742476575915083615072228655483e-11, 0.1711991790559617908601084114443031e-11, 0.8315385841420284819798357793954418e-12, 0.4042200525289440065536008957032895e-12, 0.1966475631096616490411045679010286e-12, 0.9573630387838555763782200936508615e-13, 0.4664076026428374224576492565974577e-13, 0.2273736960065972320633279596737272e-13, 0.1109139947083452201658320007192334e-13
/* = (zeta(40+1)-1)/(40+1) */
];
var POIS_COEFS_A = [-1e99,
/* placeholder used for 1-indexing */
2 / 3., -4 / 135., 8 / 2835., 16 / 8505., -8992 / 12629925., -334144 / 492567075., 698752 / 1477701225.];
var POIS_COEFS_B = [-1e99,
/* placeholder */
1 / 12., 1 / 288., -139 / 51840., -571 / 2488320., 163879 / 209018880., 5246819 / 75246796800., -534703531 / 902961561600.];
var GAMCS = [+.8571195590989331421920062399942e-2, +.4415381324841006757191315771652e-2, +.5685043681599363378632664588789e-1, -.4219835396418560501012500186624e-2, +.1326808181212460220584006796352e-2, -.1893024529798880432523947023886e-3, +.3606925327441245256578082217225e-4, -.6056761904460864218485548290365e-5, +.1055829546302283344731823509093e-5, -.1811967365542384048291855891166e-6, +.3117724964715322277790254593169e-7, -.5354219639019687140874081024347e-8, +.9193275519859588946887786825940e-9, -.1577941280288339761767423273953e-9, +.2707980622934954543266540433089e-10, -.4646818653825730144081661058933e-11, +.7973350192007419656460767175359e-12, -.1368078209830916025799499172309e-12, +.2347319486563800657233471771688e-13, -.4027432614949066932766570534699e-14, +.6910051747372100912138336975257e-15, -.1185584500221992907052387126192e-15, +.2034148542496373955201026051932e-16, -.3490054341717405849274012949108e-17, +.5987993856485305567135051066026e-18, -.1027378057872228074490069778431e-18, +.1762702816060529824942759660748e-19, -.3024320653735306260958772112042e-20, +.5188914660218397839717833550506e-21, -.8902770842456576692449251601066e-22, +.1527474068493342602274596891306e-22, -.2620731256187362900257328332799e-23, +.4496464047830538670331046570666e-24, -.7714712731336877911703901525333e-25, +.1323635453126044036486572714666e-25, -.2270999412942928816702313813333e-26, +.3896418998003991449320816639999e-27, -.6685198115125953327792127999999e-28, +.1146998663140024384347613866666e-28, -.1967938586345134677295103999999e-29, +.3376448816585338090334890666666e-30, -.5793070335782135784625493333333e-31];
var ALGMCS = [+.1666389480451863247205729650822e+0, -.1384948176067563840732986059135e-4, +.9810825646924729426157171547487e-8, -.1809129475572494194263306266719e-10, +.6221098041892605227126015543416e-13, -.3399615005417721944303330599666e-15, +.2683181998482698748957538846666e-17, -.2868042435334643284144622399999e-19, +.3962837061046434803679306666666e-21, -.6831888753985766870111999999999e-23, +.1429227355942498147573333333333e-24, -.3547598158101070547199999999999e-26, +.1025680058010470912000000000000e-27, -.3401102254316748799999999999999e-29, +.1276642195630062933333333333333e-30];
var PNORM_A = [2.2352520354606839287, 161.02823106855587881, 1067.6894854603709582, 18154.981253343561249, 0.065682337918207449113];
var PNORM_B = [47.20258190468824187, 976.09855173777669322, 10260.932208618978205, 45507.789335026729956];
var PNORM_C = [0.39894151208813466764, 8.8831497943883759412, 93.506656132177855979, 597.27027639480026226, 2494.5375852903726711, 6848.1904505362823326, 11602.651437647350124, 9842.7148383839780218, 1.0765576773720192317e-8];
var PNORM_D = [22.266688044328115691, 235.38790178262499861, 1519.377599407554805, 6485.558298266760755, 18615.571640885098091, 34900.952721145977266, 38912.003286093271411, 19685.429676859990727];
var PNORM_P = [0.21589853405795699, 0.1274011611602473639, 0.022235277870649807, 0.001421619193227893466, 2.9112874951168792e-5, 0.02307344176494017303];
var PNORM_Q = [1.28426009614491121, 0.468238212480865118, 0.0659881378689285515, 0.00378239633202758244, 7.29751555083966205e-5];

var R_D__0 = function R_D__0(log_p) {
  return log_p ? -Infinity : 0.0;
};

var R_D__1 = function R_D__1(log_p) {
  return log_p ? 0.0 : 1.0;
};

var R_DT_0 = function R_DT_0(lower_tail, log_p) {
  return lower_tail ? R_D__0(log_p) : R_D__1(log_p);
};

var R_DT_1 = function R_DT_1(lower_tail, log_p) {
  return lower_tail ? R_D__1(log_p) : R_D__0(log_p);
}; // const R_D_half = () => (log_p ? -M_LN2 : 0.5);
// This is some sort of trick by using 0.5 - p + 0.5 to "perhaps gain 1 bit of accuracy"


var R_D_Lval = function R_D_Lval(p, lower_tail) {
  return lower_tail ? p : 0.5 - p + 0.5;
};

var R_D_Cval = function R_D_Cval(p, lower_tail) {
  return lower_tail ? 0.5 - p + 0.5 : p;
};

var R_D_val = function R_D_val(x, log_p) {
  return log_p ? Math.log(x) : x;
};

var R_D_log = function R_D_log(p, log_p) {
  return log_p ? p : Math.log(p);
};

var R_D_Clog = function R_D_Clog(p, log_p) {
  return log_p ? Math.log1p(-p) : 0.5 - p + 0.5;
};

var R_DT_val = function R_DT_val(x, lower_tail, log_p) {
  return lower_tail ? R_D_val(x, log_p) : R_D_Clog(x, log_p);
};

var R_D_LExp = function R_D_LExp(x, log_p) {
  return log_p ? R_Log1_Exp(x) : Math.log1p(-x);
}; // Be careful, for some reason they named two functions off by only 1 capital letter...
// R_DT_log != R_DT_Log


var R_DT_log = function R_DT_log(p, lower_tail) {
  return lower_tail ? R_D_log(p) : R_D_LExp(p);
};

var R_DT_Clog = function R_DT_Clog(p, lower_tail) {
  return lower_tail ? R_D_LExp(p) : R_D_log(p);
}; //const R_DT_Log = (p, lower_tail) => (lower_tail ? p : R_Log1_Exp(p));

/**
 * See warning for R_Q_P01_boundaries (this function should be wrapped in try/catch.)
 */


function R_Q_P01_check(p, log_p) {
  if (log_p && p > 0 || !log_p && (p < 0 || p > 1)) {
    throw ML_ERR_return_NAN();
  }
}
/**
 * Note this has changed from the R implementation which was a C macro.
 * You should wrap this in a try catch, like:
 * try {
 *   boundaries(...)
 * }
 * catch (e) { return e; }
 */


function R_Q_P01_boundaries(p, lower_tail, log_p, left, right) {
  if (log_p) {
    if (p > 0) {
      throw ML_ERR_return_NAN();
    }

    if (p === 0) {
      throw lower_tail ? right : left;
    }

    if (p === Number.NEGATIVE_INFINITY) {
      throw lower_tail ? left : right;
    }
  } else {
    if (p < 0 || p > 1) {
      throw ML_ERR_return_NAN();
    }

    if (p === 0) {
      throw lower_tail ? left : right;
    }

    if (p === 1) {
      throw lower_tail ? right : left;
    }
  }
}

function R_P_bounds_01(x, x_min, x_max, lower_tail, log_p) {
  if (x <= x_min) {
    throw R_DT_0(lower_tail, log_p);
  }

  if (x >= x_max) {
    throw R_DT_1(lower_tail, log_p);
  }
}

function R_DT_qIv(p, lower_tail, log_p) {
  if (log_p) {
    if (lower_tail) {
      return Math.exp(p);
    } else {
      return -Math.expm1(p);
    }
  } else {
    return R_D_Lval(p, lower_tail);
  }
}

function R_DT_CIv(p, lower_tail, log_p) {
  if (log_p) {
    if (lower_tail) {
      return -Math.expm1(p);
    } else {
      return Math.exp(p);
    }
  } else {
    return R_D_Cval(p);
  }
}

function fmin2(x, y) {
  if (isNaN(x) || isNaN(y)) {
    return x + y;
  }

  return x < y ? x : y;
}

function fmax2(x, y) {
  if (isNaN(x) || isNaN(y)) {
    return x + y;
  }

  return x < y ? y : x;
}

function expm1(x) {
  var y,
      a = Math.abs(x);

  if (a < DBL_EPSILON) {
    return x;
  }

  if (a > 0.697) {
    return Math.exp(x) - 1;
  }

  if (a > 1e-8) {
    y = Math.exp(x) - 1;
  } else {
    y = (x / 2 + 1) * x;
  }

  y -= (1 + y) * (Math.log1p(y) - x);
  return y;
}

function R_Log1_Exp(x) {
  return x > -M_LN2 ? Math.log(-Math.expm1(x)) : Math.log1p(-Math.exp(x));
}

function R_D_exp(x, log_p) {
  return log_p ? x : Math.exp(x);
}

function R_D_fexp(f, x, give_log) {
  return give_log ? -0.5 * Math.log(f) + x : Math.exp(x) / Math.sqrt(f);
}

function sinpi(x) {
  if (isNaN(x)) {
    return x;
  }

  if (!Number.isFinite(x)) {
    return NaN;
  }

  x = x % 2;

  if (x <= -1) {
    x += 2.0;
  } else if (x > 1.0) {
    x -= 2.0;
  }

  if (x == 0.0 || x == 1.0) {
    return 0.0;
  }

  if (x == 0.5) {
    return 1.0;
  }

  if (x == -0.5) {
    return -1.0;
  }

  return Math.sin(M_PI * x);
}

function chebyshev_eval(x, a, n) {
  var b0, b1, b2, twox, i;

  if (n < 1 || n > 1000) {
    return NaN;
  }

  if (x < -1.1 || x > 1.1) {
    return NaN;
  }

  twox = x * 2;
  b2 = b1 = 0;
  b0 = 0;

  for (i = 1; i <= n; i++) {
    b2 = b1;
    b1 = b0;
    b0 = twox * b1 - b2 + a[n - i];
  }

  return (b0 - b2) * 0.5;
}

function lgammacor(x) {
  var tmp;
  var nalgm = 5;
  var xbig = 94906265.62425156;
  var xmax = 3.745194030963158e306;

  if (x < 10) {
    return NaN;
  } else if (x > xmax) {
    throw "lgammacor underflow";
  } else if (x < xbig) {
    tmp = 10 / x;
    return chebyshev_eval(tmp * tmp * 2 - 1, ALGMCS, nalgm) / x;
  }

  return 1 / (x * 12);
}

function gammafn(x) {
  var i, n, y, sinpiy, value;
  var ngam = 22;
  var xmin = -170.5674972726612;
  var xmax = 171.61447887182298;
  var xsml = 2.2474362225598545e-308;

  if (isNaN(x)) {
    return x;
  }

  if (x == 0 || x < 0 && x == Math.round(x)) {
    return NaN;
  }

  y = Math.abs(x);

  if (y <= 10) {
    n = parseInt(x, 10);

    if (x < 0) {
      n--;
    }

    y = x - n;
    n--;
    value = chebyshev_eval(y * 2 - 1, GAMCS, ngam) + .9375;

    if (n == 0) {
      return value;
    }

    if (n < 0) {
      if (x < -0.5 && Math.abs(x - parseInt(x - 0.5, 10) / x) < DXREL) {
        throw "gammafn precision error";
      }

      if (x < xsml) {
        return x > 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
      }

      n = -n;

      for (i = 0; i < n; i++) {
        value /= x + i;
      }

      return value;
    } else {
      for (i = 1; i <= n; i++) {
        value *= y + i;
      }

      return value;
    }
  } else {
    if (x > xmax) {
      return Number.POSITIVE_INFINITY;
    }

    if (x < xmin) {
      return 0;
    }

    if (y <= 50 && y == parseInt(y, 10)) {
      value = 1;

      for (i = 2; i < y; i++) {
        value *= i;
      }
    } else {
      value = Math.exp((y - 0.5) * Math.log(y) - y - M_LN_SQRT_2PI + (2 * y == parseInt(2 * y, 10) ? stirlerr(y) : lgammacor(y)));
    }

    if (x > 0) {
      return value;
    }

    if (Math.abs(x - parseInt(x - 0.5, 10) / x) < DXREL) {
      throw "gammafn precision error";
    }

    sinpiy = sinpi(y);

    if (sinpiy == 0) {
      return Number.POSITIVE_INFINITY;
    }

    return -M_PI / (y * sinpiy * value);
  }
}

function lgammafn_sign(x) {
  var ans, y, sinpiy; //sgn = 1;

  var xmax = 2.5327372760800758e+305;

  if (isNaN(x)) {
    return x;
  }

  if (x < 0 && Math.floor(-x) % 2 == 0) {//sgn = -1;
  }

  if (x <= 0 && x == Math.trunc(x)) {
    return Number.POSITIVE_INFINITY;
  }

  y = Math.abs(x);
  if (y < 1e-306) return -Math.log(y);
  if (y <= 10) return Math.log(Math.abs(gammafn(x)));

  if (y > xmax) {
    return Number.POSITIVE_INFINITY;
  }

  if (x > 0) {
    if (x > 1e17) {
      return x * (Math.log(x) - 1);
    } else if (x > 4934720.) {
      return M_LN_SQRT_2PI + (x - 0.5) * Math.log(x) - x;
    } else {
      return M_LN_SQRT_2PI + (x - 0.5) * Math.log(x) - x + lgammacor(x);
    }
  }

  sinpiy = Math.abs(sinpi(y));

  if (sinpiy == 0) {
    return NaN;
  }

  if (Math.abs((x - Math.trunc(x - 0.5)) * ans / x) < DXREL) {
    throw "lgamma precision error";
  }

  return ans;
}

function lgammafn(x) {
  return lgammafn_sign(x, null);
}

function stirlerr(n) {
  var nn;

  if (n <= 15) {
    nn = n + n;

    if (nn == Math.floor(nn)) {
      return SFERR_HALVES[Math.floor(nn)];
    }

    return lgammafn(n + 1.0) - (n + 0.5) * Math.log(n) + n - M_LN_SQRT_2PI;
  }

  nn = n * n;

  if (n > 500) {
    return (S0 - S1 / nn) / n;
  }

  if (n > 80) {
    return (S0 - (S1 - S2 / nn) / nn) / n;
  }

  if (n > 35) {
    return (S0 - (S1 - (S2 - S3 / nn) / nn) / nn) / n;
  }

  return (S0 - (S1 - (S2 - (S3 - S4 / nn) / nn) / nn) / nn) / n;
}

function bd0(x, np) {
  var ej, s, s1, v, j;

  if (!Number.isFinite(x) || !Number.isFinite(np) || np == 0) {
    return NaN;
  }

  if (Math.abs(x - np) < 0.1 * (x + np)) {
    v = (x - np) / (x + np);
    s = (x - np) * v;

    if (Math.abs(s) < DBL_MIN) {
      return s;
    }

    ej = 2 * x * v;
    v = v * v;

    for (j = 1; j < 1000; j++) {
      ej *= v;
      s1 = s + ej / (j * 2 + 1);

      if (s1 == s) {
        return s1;
      }

      s = s1;
    }
  }

  return x * Math.log(x / np) + np - x;
}

function dpois_raw(x, lambda, give_log) {
  if (lambda == 0) {
    return x == 1 ? R_D(1, give_log) : R_D(0, give_log);
  }

  if (!Number.isFinite(lambda)) {
    return R_D(0, give_log);
  }

  if (x < 0) {
    return R_D(0, give_log);
  }

  if (x <= lambda * DBL_MIN) {
    return R_D_exp(-lambda, give_log);
  }

  if (lambda < x * DBL_MIN) {
    return R_D_exp(-lambda + x * Math.log(lambda) - lgammafn(x + 1), give_log);
  }

  return R_D_fexp(M_2PI * x, -stirlerr(x) - bd0(x, lambda), give_log);
}

function logcf(x, i, d, eps) {
  var c1 = 2 * d;
  var c2 = i + d;
  var c3;
  var c4 = c2 + d;
  var a1 = c2;
  var b1 = i * (c2 - i * x);
  var b2 = d * d * x;
  var a2 = c4 * c2 - b2;
  b2 = c4 * b1 - i * b2;

  while (Math.abs(a2 * b1 - a1 * b2) > Math.abs(eps * b1 * b2)) {
    c3 = c2 * c2 * x;
    c2 += d;
    c4 += d;
    a1 = c4 * a2 - c3 * a1;
    b1 = c4 * b2 - c3 * b1;
    c3 = c1 * c1 * x;
    c1 += d;
    c4 += d;
    a2 = c4 * a1 - c3 * a2;
    b2 = c4 * b1 - c3 * b2;

    if (Math.abs(b2) > SCALE_FACTOR) {
      a1 /= SCALE_FACTOR;
      a2 /= SCALE_FACTOR;
      b1 /= SCALE_FACTOR;
      b2 /= SCALE_FACTOR;
    } else if (Math.abs(b2) < 1 / SCALE_FACTOR) {
      a1 *= SCALE_FACTOR;
      a2 *= SCALE_FACTOR;
      b1 *= SCALE_FACTOR;
      b2 *= SCALE_FACTOR;
    }
  }

  return a2 / b2;
}

function log1pmx(x) {
  var minLog1Value = -0.79149064;

  if (x > 1 || x < minLog1Value) {
    return Math.log1p(x) - x;
  } else {
    var r = x / (2 + x);
    var y = r * r;

    if (Math.abs(x) < 1e-2) {
      return r * ((((2 / 9 * y + 2 / 7) * y + 2 / 5) * y + 2 / 3) * y - x);
    } else {
      return r * (2 * y * logcf(y, 3, 2, TOL_LOGCF) - x);
    }
  }
}

function lgamma1p(a) {
  if (Math.abs(a) >= 0.5) {
    return lgammafn(a + 1);
  }

  var lgam, i;
  lgam = LGAMMA_C * logcf(-a / 2, LGAMMA_COEFS.length + 2, 1, TOL_LOGCF);

  for (i = LGAMMA_COEFS.length - 1; i >= 0; i--) {
    lgam = LGAMMA_COEFS[i] - a * lgam;
  }

  return (a * lgam - EULERS_CONST) * a - log1pmx(a);
}

function logspace_add(logx, logy) {
  return (logx > logy ? logx : logy) + Math.log1p(Math.exp(-Math.abs(logx - logy)));
} // function logspace_sub(logx, logy) {
//   return logx + R_Log1_Exp(logy - logx);
// }
// function logspace_sum(logx, n) {
//   if (n == 0) {
//     return Number.NEGATIVE_INFINITY;
//   }
//   if (n == 1) {
//     return logx[0];
//   }
//   if (n == 2) {
//     return logspace_add(logx[0] + logx[1]);
//   }
//   var i;
//   var Mx = logx[0];
//   for (i = 1; i < n; i++) {
//     if (Mx < logx[i]) {
//       Mx = logx[i];
//     }
//   }
//   var s = 0;
//   for (i = 0; i < n; i++) {
//     s += Math.exp(logx[i] - Mx);
//   }
//   return Mx + Math.log(s);
// }


function dpois_wrap(x_plus_1, lambda, give_log) {
  if (!isFinite(lambda)) {
    return R_D(0, give_log);
  }

  if (x_plus_1 > 1) {
    return dpois_raw(x_plus_1 - 1, lambda, give_log);
  }

  if (lambda > Math.abs(x_plus_1 - 1) * M_CUTOFF) {
    return R_D_exp(-lambda - lgammafn(x_plus_1), give_log);
  } else {
    var d = dpois_raw(x_plus_1, lambda, give_log);
    return give_log ? d + Math.log(x_plus_1 / lambda) : d * (x_plus_1 / lambda);
  }
}

function R_D(i, log_p) {
  if (i === 0) {
    return log_p ? Number.NEGATIVE_INFINITY : 0;
  } else {
    return log_p ? 0 : 1;
  }
}

function R_DT(i, lower_tail, log_p) {
  if (i === 0) {
    return lower_tail ? R_D(0, log_p) : R_D(1, log_p);
  } else {
    return lower_tail ? R_D(1, log_p) : R_D(0, log_p);
  }
}

function pgamma_smallx(x, alph, lower_tail, log_p) {
  var sum = 0,
      c = alph,
      n = 0,
      term;

  do {
    n++;
    c *= -x / n;
    term = c / (alph + n);
    sum += term;
  } while (Math.abs(term) > DBL_EPSILON * Math.abs(sum));

  if (lower_tail) {
    var f1 = log_p ? Math.log1p(sum) : 1 + sum;
    var f2;

    if (alph > 1) {
      f2 = dpois_raw(alph, x, log_p);
      f2 = log_p ? f2 + x : f2 * Math.exp(x);
    } else if (log_p) {
      f2 = alph * Math.log(x) - lgamma1p(alph);
    } else {
      f2 = Math.pow(x, alph) / Math.exp(lgamma1p(alph));
    }

    return log_p ? f1 + f2 : f1 * f2;
  } else {
    var lf2 = alph * Math.log(x) - lgamma1p(alph);

    if (log_p) {
      return R_Log1_Exp(Math.log1p(sum) + lf2);
    } else {
      var f1m1 = sum;
      var f2m1 = Math.expm1(lf2);
      return -(f1m1 + f2m1 + f1m1 * f2m1);
    }
  }
}

function pd_upper_series(x, y, log_p) {
  var term = x / y;
  var sum = term;

  do {
    y++;
    term *= x / y;
    sum += term;
  } while (term > sum * DBL_EPSILON);

  return log_p ? Math.log(sum) : sum;
}

function pd_lower_cf(y, d) {
  var f = 0,
      of,
      f0;
  var i, c2, c3, c4, a1, b1, a2, b2;

  if (y == 0) {
    return 0;
  }

  f0 = y / d;

  if (Math.abs(y - 1) < Math.abs(d) * DBL_EPSILON) {
    return f0;
  }

  if (f0 > 1.0) {
    f0 = 1.0;
  }

  c2 = y;
  c4 = d;
  a1 = 0;
  b1 = 1;
  a2 = y;
  b2 = d;

  while (b2 > SCALE_FACTOR) {
    a1 /= SCALE_FACTOR;
    b1 /= SCALE_FACTOR;
    a2 /= SCALE_FACTOR;
    b2 /= SCALE_FACTOR;
  }

  i = 0;
  of = -1;

  while (i < 200000) {
    i++;
    c2--;
    c3 = i * c2;
    c4 += 2;
    a1 = c4 * a2 + c3 * a1;
    b1 = c4 * b2 + c3 * b1;
    i++;
    c2--;
    c3 = i * c2;
    c4 += 2;
    a2 = c4 * a1 + c3 * a2;
    b2 = c4 * b1 + c3 * b2;

    if (b2 > SCALE_FACTOR) {
      a1 /= SCALE_FACTOR;
      b1 /= SCALE_FACTOR;
      a2 /= SCALE_FACTOR;
      b2 /= SCALE_FACTOR;
    }

    if (b2 != 0) {
      f = a2 / b2;

      if (Math.abs(f - of) <= DBL_EPSILON * (Math.abs(f) > f0 ? Math.abs(f) : f0)) {
        return f;
      }

      of = f;
    }
  } //WARNING - NON CONVERGENCE


  return f;
}

function pd_lower_series(lambda, y) {
  var term = 1,
      sum = 0;

  while (y >= 1 && term > sum * DBL_EPSILON) {
    term *= y / lambda;
    sum += term;
    y--;
  }

  if (y !== Math.floor(y)) {
    var f = pd_lower_cf(y, lambda + 1 - y);
    sum += term * f;
  }

  return sum;
}

function dpnorm(x, lower_tail, lp) {
  if (x < 0) {
    x = -x;
    lower_tail = !lower_tail;
  }

  if (x > 10 && !lower_tail) {
    var term = 1 / x,
        sum = term,
        x2 = x * x,
        i = 1;

    do {
      term *= -i / x2;
      sum += term;
      i += 2;
    } while (Math.abs(term) > DBL_EPSILON * sum);

    return 1 / sum;
  } else {
    var d = dnorm(x, 0.0, 1.0, false);
    return d / Math.exp(lp);
  }
}

function ppois_asymp(x, lambda, lower_tail, log_p) {
  var coefs_a = POIS_COEFS_A,
      coefs_b = POIS_COEFS_B;
  var elfb, elfb_term;
  var res12, res1_term, res1_ig, res2_term, res2_ig;
  var dfm, pt_, s2pt, f, np;
  var i;
  dfm = lambda - x;
  pt_ = -log1pmx(dfm / x);
  s2pt = Math.sqrt(2 * x * pt_);

  if (dfm < 0) {
    s2pt = -s2pt;
  }

  res12 = 0;
  res1_ig = res1_term = Math.sqrt(x);
  res2_ig = res2_term = s2pt;

  for (i = 1; i < 8; i++) {
    res12 += res1_ig * coefs_a[i];
    res12 += res2_ig * coefs_b[i];
    res1_term *= pt_ / i;
    res2_term *= 2 * pt_ / (2 * i + 1);
    res1_ig = res1_ig / x + res1_term;
    res2_ig = res2_ig / x + res2_term;
  }

  elfb = x;
  elfb_term = 1;

  for (i = 1; i < 8; i++) {
    elfb += elfb_term * coefs_b[i];
    elfb_term /= x;
  }

  if (!lower_tail) {
    elfb = -elfb;
  }

  f = res12 / elfb;
  np = pnorm(s2pt, 0.0, 1.0, !lower_tail, log_p);

  if (log_p) {
    var n_d_over_p = dpnorm(s2pt, !lower_tail, np);
    return np + Math.log1p(f * n_d_over_p);
  } else {
    var nd = dnorm(s2pt, 0.0, 1.0, log_p);
    return np + f * nd;
  }
}

function pgamma_raw(x, alph, lower_tail, log_p) {
  var res, d, sum;

  try {
    R_P_bounds_01(x, 0.0, Number.POSITIVE_INFINITY, lower_tail, log_p);
  } catch (e) {
    return e;
  }

  if (x < 1) {
    res = pgamma_smallx(x, alph, lower_tail, log_p);
  } else if (x <= alph - 1 && x < 0.8 * (alph + 50)) {
    // incl large alph compared to x
    sum = pd_upper_series(x, alph, log_p);
    d = dpois_wrap(alph, x, log_p);

    if (!lower_tail) {
      res = log_p ? R_Log1_Exp(d + sum) : 1 - d * sum;
    } else {
      res = log_p ? sum + d : sum * d;
    }
  } else if (alph - 1 < x && alph < 0.8 * (x + 50)) {
    // incl large x compared to alph
    d = dpois_wrap(alph, x, log_p);

    if (alph < 1) {
      if (x * DBL_EPSILON > 1 - alph) {
        sum = R_D(0, log_p);
      } else {
        var f = pd_lower_cf(alph, x - (alph - 1)) * x / alph;
        sum = log_p ? Math.log(f) : f;
      }
    } else {
      sum = pd_lower_series(x, alph - 1);
      sum = log_p ? Math.log1p(sum) : 1 + sum;
    }

    if (!lower_tail) {
      res = log_p ? sum + d : sum * d;
    } else {
      res = log_p ? R_Log1_Exp(d + sum) : 1 - d * sum;
    }
  } else {
    //x >=1 and x near alph
    res = ppois_asymp(alph - 1, x, !lower_tail, log_p);
  }

  if (!log_p && res < DBL_MIN / DBL_EPSILON) {
    return Math.exp(pgamma_raw(x, alph, lower_tail, true));
  } else {
    return res;
  }
} // function dpois(x, lambda, give_log) {
//   if (lambda < 0) {
//     return NaN;
//   }
//   if (x % 1 != 0) {
//     return NaN;
//   }
//   if (x < 0 || !Number.isFinite(x)) {
//     return R_D(0, give_log);
//   }
//   return dpois_raw(x, lambda, give_log);
//
// }


function pgamma(x, alph, scale, lower_tail, log_p) {
  if (isNaN(x) || alph < 0 || scale < 0) {
    return NaN;
  }

  x /= scale;

  if (alph == 0) {
    return x <= 0 ? R_DT(0, lower_tail, log_p) : R_DT(1, lower_tail, log_p);
  }

  return pgamma_raw(x, alph, lower_tail, log_p);
}
/**
 * The gamma density function.
 * @param x
 * @param shape
 * @param scale
 * @param give_log
 * @return {number|*}
 */


function dgamma(x, shape, scale, give_log) {
  x = parseNumeric(x);
  shape = parseNumeric(shape);
  scale = parseNumeric(scale);
  give_log = parseBoolean(give_log);
  var pr;

  if (isNaN(x) || isNaN(shape) || isNaN(scale)) {
    return x + shape + scale;
  }

  if (shape < 0 || scale <= 0) {
    ML_ERR_return_NAN;
  }

  if (x < 0) {
    return R_D__0(give_log);
  }

  if (shape === 0) {
    return x === 0 ? Infinity : R_D__0(give_log);
  }

  if (x === 0) {
    if (shape < 1) {
      return Infinity;
    }

    if (shape > 1) {
      return R_D__0(give_log);
    }

    return give_log ? -Math.log(scale) : 1 / scale;
  }

  if (shape < 1) {
    pr = dpois_raw(shape, x / scale, give_log);
    return give_log ? pr + Math.log(shape / x) : pr * shape / x;
  }

  pr = dpois_raw(shape - 1, x / scale, give_log);
  return give_log ? pr - Math.log(scale) : pr / scale;
}
/**
 * The chi-squared density function.
 * @param x
 * @param df
 * @param give_log
 * @return {number|*}
 */

function dchisq(x, df, give_log) {
  return dgamma(x, df / 2.0, 2.0, give_log);
}
/**
 * The chi-squared cumulative distribution function.
 *
 * Supports the non-centrality parameter ncp.
 *
 * @param x {number} Value.
 * @param df {number} Degrees of freedom.
 * @param ncp {number} Non-centrality parameter.
 * @param lower_tail {boolean} Return cumulative probability from lower tail?
 * @param log_p {boolean} Return log probability
 */

function pchisq(x, df) {
  var ncp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var lower_tail = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var log_p = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  x = parseNumeric(x);
  df = parseNumeric(df);
  ncp = parseNumeric(ncp);
  lower_tail = parseBoolean(lower_tail);
  log_p = parseBoolean(log_p);

  if (ncp === 0) {
    return pgamma(x, df / 2.0, 2.0, lower_tail, log_p);
  } else {
    return pnchisq(x, df, ncp, lower_tail, log_p);
  }
}

function pnchisq(q, df) {
  var ncp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var lower_tail = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var log_p = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  if (df < 0 || ncp < 0) {
    return NaN;
  }

  var ans = pnchisq_raw(q, df, ncp, 1e-12, 8 * DBL_EPSILON, 1000000, lower_tail, log_p);

  if (ncp >= 80) {
    if (lower_tail) {
      ans = fmin2(ans, R_D__1(log_p));
    } else {
      if (ans < (log_p ? -10.0 * M_LN10 : 1e-10)) {
        ML_ERROR(ME_PRECISION, "pnchisq");
      }

      if (!log_p) {
        ans = fmax2(ans, 0.0);
      }
    }
  }

  if (!log_p || ans < -1e-8) {
    return ans;
  } else {
    ans = pnchisq_raw(q, df, ncp, 1e-12, 8 * DBL_EPSILON, 1000000, !lower_tail, false);
    return Math.log1p(-ans);
  }
}

function pnchisq_raw(x, f, theta, errmax, reltol, itrmax, lower_tail, log_p) {
  var lam, x2, f2, term, bound, f_x_2n, f_2n;
  var l_lam = -1.0;
  var l_x = -1.0;
  var n;
  var lamSml, tSml, is_r, is_b, is_it;
  var ans,
      u,
      v,
      t,
      lt,
      lu = -1;

  if (x <= 0.0) {
    if (x === 0.0 && f === 0.0) {
      var _L = -0.5 * theta;

      return lower_tail ? R_D_exp(_L, log_p) : log_p ? R_Log1_Exp(_L) : -expm1(_L);
    }

    return R_DT_0(lower_tail, log_p);
  }

  if (!isFinite(x)) {
    return R_DT_1(lower_tail, log_p);
  }

  if (theta < 80) {
    var _ans;

    if (lower_tail && f > 0.0 && Math.log(x) < M_LN2 + 2 / f * (lgammafn(f / 2.0 + 1) + _dbl_min_exp)) {
      var lambda = 0.5 * theta;
      var sum,
          sum2,
          pr = -lambda;
      sum = sum2 = -Infinity;

      for (var i = 0; i < 110; pr === Math.log(lambda) - Math.log(++i)) {
        sum2 = logspace_add(sum2, pr);
        sum = logspace_add(sum, pr + pchisq(x, f + 2 * i, 0, lower_tail, true));
        if (sum2 >= -1e-15) break;
      }

      _ans = sum - sum2;
      return log_p ? _ans : Math.exp(_ans);
    } else {
      var _lambda = 0.5 * theta;

      var _sum = 0,
          _sum2 = 0,
          _pr = Math.exp(-_lambda);
      /* we need to renormalize here: the result could be very close to 1 */


      for (var _i = 0; _i < 110; _pr *= _lambda / ++_i) {
        _sum2 += _pr;
        _sum += _pr * pchisq(x, f + 2 * _i, 0, lower_tail, false);
        if (_sum2 >= 1 - 1e-15) break;
      }

      _ans = _sum / _sum2;
      return log_p ? Math.log(_ans) : _ans;
    }
  }

  lam = .5 * theta;
  lamSml = -lam < _dbl_min_exp;

  if (lamSml) {
    u = 0;
    lu = -lam;
    /* == ln(u) */

    l_lam = Math.log(lam);
  } else {
    u = Math.exp(-lam);
  }

  v = u;
  x2 = .5 * x;
  f2 = .5 * f;
  f_x_2n = f - x;

  if (f2 * DBL_EPSILON > 0.125 && Math.abs(t = x2 - f2) < Math.sqrt(DBL_EPSILON) * f2) {
    lt = (1 - t) * (2 - t / (f2 + 1)) - M_LN_SQRT_2PI - 0.5 * Math.log(f2 + 1);
  } else {
    lt = f2 * Math.log(x2) - x2 - lgammafn(f2 + 1);
  }

  tSml = lt < _dbl_min_exp;

  if (tSml) {
    if (x > f + theta + 5 * Math.sqrt(2 * (f + 2 * theta))) {
      return R_DT_1(lower_tail, log_p);
    }

    l_x = Math.log(x);
    ans = term = 0.;
    t = 0;
  } else {
    t = Math.exp(lt);
    ans = term = v * t;
  }

  for (n = 1, f_2n = f + 2., f_x_2n += 2.;; n++, f_2n += 2, f_x_2n += 2) {
    if (f_x_2n > 0) {
      bound = t * x / f_x_2n;
      is_b = bound <= errmax;
      is_r = term <= reltol * ans;
      is_it = n > itrmax;

      if (is_b && is_r || is_it) {
        break;
      }
    }

    if (lamSml) {
      lu += l_lam - Math.log(n);
      /* u = u* lam / n */

      if (lu >= _dbl_min_exp) {
        /* no underflow anymore ==> change regime */
        v = u = Math.exp(lu);
        /* the first non-0 'u' */

        lamSml = false;
      }
    } else {
      u *= lam / n;
      v += u;
    }

    if (tSml) {
      lt += l_x - Math.log(f_2n);
      /* t <- t * (x / f2n) */

      if (lt >= _dbl_min_exp) {
        /* no underflow anymore ==> change regime */
        t = Math.exp(lt);
        /* the first non-0 't' */

        tSml = false;
      }
    } else {
      t *= x / f_2n;
    }

    if (!lamSml && !tSml) {
      term = v * t;
      ans += term;
    }
  }

  if (is_it) {
    console.error("pnchisq(x=".concat(x, ",...) not converged in ").concat(itrmax));
  }

  var dans = ans;
  return R_DT_val(dans, lower_tail, log_p);
}

function qnorm(p, mu, sigma, lower_tail, log_p) {
  var p_, q, r, val;

  if (isNaN(p) || isNaN(mu) || isNaN(sigma)) {
    return p + mu + sigma;
  }

  try {
    R_Q_P01_boundaries(p, lower_tail, log_p, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
  } catch (e) {
    return e;
  }

  if (sigma < 0) {
    return ML_ERR_return_NAN();
  }

  if (sigma === 0) {
    return mu;
  }

  p_ = R_DT_qIv(p, lower_tail, log_p);
  q = p_ - 0.5;

  if (Math.abs(q) <= .425) {
    /* 0.075 <= p <= 0.925 */
    r = .180625 - q * q;
    val = q * (((((((r * 2509.0809287301226727 + 33430.575583588128105) * r + 67265.770927008700853) * r + 45921.953931549871457) * r + 13731.693765509461125) * r + 1971.5909503065514427) * r + 133.14166789178437745) * r + 3.387132872796366608) / (((((((r * 5226.495278852854561 + 28729.085735721942674) * r + 39307.89580009271061) * r + 21213.794301586595867) * r + 5394.1960214247511077) * r + 687.1870074920579083) * r + 42.313330701600911252) * r + 1.);
  } else {
    /* closer than 0.075 from {0,1} boundary */

    /* r = min(p, 1-p) < 0.075 */
    if (q > 0) {
      r = R_DT_CIv(p, lower_tail, log_p);
      /* 1-p */
    } else {
      r = p_;
      /* = R_DT_Iv(p) ^=  p */
    }

    r = Math.sqrt(-(log_p && (lower_tail && q <= 0 || !lower_tail && q > 0) ? p :
    /* else */
    Math.log(r)));
    /* r = sqrt(-log(r))  <==>  min(p, 1-p) = exp( - r^2 ) */

    if (r <= 5.) {
      /* <==> min(p,1-p) >= exp(-25) ~= 1.3888e-11 */
      r += -1.6;
      val = (((((((r * 7.7454501427834140764e-4 + .0227238449892691845833) * r + .24178072517745061177) * r + 1.27045825245236838258) * r + 3.64784832476320460504) * r + 5.7694972214606914055) * r + 4.6303378461565452959) * r + 1.42343711074968357734) / (((((((r * 1.05075007164441684324e-9 + 5.475938084995344946e-4) * r + .0151986665636164571966) * r + .14810397642748007459) * r + .68976733498510000455) * r + 1.6763848301838038494) * r + 2.05319162663775882187) * r + 1.);
    } else {
      /* very close to  0 or 1 */
      r += -5.;
      val = (((((((r * 2.01033439929228813265e-7 + 2.71155556874348757815e-5) * r + .0012426609473880784386) * r + .026532189526576123093) * r + .29656057182850489123) * r + 1.7848265399172913358) * r + 5.4637849111641143699) * r + 6.6579046435011037772) / (((((((r * 2.04426310338993978564e-15 + 1.4215117583164458887e-7) * r + 1.8463183175100546818e-5) * r + 7.868691311456132591e-4) * r + .0148753612908506148525) * r + .13692988092273580531) * r + .59983220655588793769) * r + 1.);
    }

    if (q < 0.0) {
      val = -val;
    }
    /* return (q >= 0.)? r : -r ;*/

  }

  return mu + sigma * val;
}

function qchisq_appr(p, nu, g, lower_tail, log_p, tol) {
  var C7 = 4.67;
  var C8 = 6.66;
  var C9 = 6.73;
  var C10 = 13.32;
  var alpha, a, c, ch, p1;
  var p2, q, t, x;

  if (isNaN(p) || isNaN(nu)) {
    return p + nu;
  }

  try {
    R_Q_P01_check(p, log_p);
  } catch (e) {
    return e;
  }

  if (nu <= 0) {
    return ML_ERR_return_NAN();
  }

  alpha = 0.5 * nu;
  c = alpha - 1;

  if (nu < -1.24 * (p1 = R_DT_log(p))) {
    var lgam1pa = alpha < 0.5 ? lgamma1p(alpha) : Math.log(alpha) + g;
    ch = Math.exp((lgam1pa + p1) / alpha + M_LN2);
  } else if (nu > 0.32) {
    x = qnorm(p, 0, 1, lower_tail, log_p);
    p1 = 2.0 / (9 * nu);
    ch = nu * Math.pow(x * Math.sqrt(p1) + 1 - p1, 3);

    if (ch > 2.2 * nu + 6) {
      ch = -2 * (R_DT_Clog(p, lower_tail) - c * Math.log(0.5 * ch) + g);
    }
  } else {
    ch = 0.4;
    a = R_DT_Clog(p, lower_tail) + g + c * M_LN2;

    do {
      q = ch;
      p1 = 1.0 / (1 + ch * (C7 + ch));
      p2 = ch * (C9 + ch * (C8 + ch));
      t = -0.5 + (C7 + 2 * ch) * p1 - (C9 + ch * (C10 + 3 * ch)) / p2;
      ch -= (1 - Math.exp(a + 0.5 * ch) * p2 * p1) / t;
    } while (Math.abs(q - ch) > tol * Math.abs(ch));
  }

  return ch;
}
/**
 * Inverse CDF / quantile function of gamma distribution.
 * @param p
 * @param alpha
 * @param scale
 * @param lower_tail
 * @param log_p
 * @return {*|number|number|*}
 */


function qgamma(p, alpha, scale, lower_tail, log_p) {
  var EPS1 = 1e-2;
  var EPS2 = 5e-7;
  var EPS_N = 1e-15; //const LN_EPS = -36.043653389117156;

  var MAXIT = 1000;
  var pMIN = 1e-100;
  var pMAX = 1 - 1e-14;
  var i420 = 1.0 / 420.0;
  var i2520 = 1.0 / 2520.0;
  var i5040 = 1.0 / 5040.0;
  var p_, a, b, c, g, ch, ch0, p1;
  var p2, q, s1, s2, s3, s4, s5, s6, t, x;
  var max_it_Newton = 1;

  if (isNaN(p) || isNaN(alpha) || isNaN(scale)) {
    return p + alpha + scale;
  }

  try {
    R_Q_P01_boundaries(p, lower_tail, log_p, 0.0, Number.POSITIVE_INFINITY);
  } catch (e) {
    return e;
  }

  if (alpha < 0 || scale <= 0) {
    return ML_ERR_return_NAN();
  }

  if (alpha === 0) {
    return 0.0;
  }

  if (alpha < 1e-10) {
    max_it_Newton = 7;
  }

  p_ = R_DT_qIv(p, lower_tail, log_p);
  g = lgammafn(alpha); // Closure to mimic the ugly 'goto END' everywhere

  function end() {
    x = 0.5 * scale * ch;

    if (max_it_Newton) {
      if (!log_p) {
        p = Math.log(p);
        log_p = true;
      }

      if (x === 0) {
        var _1_p = 1.0 + 1e-7;

        var _1_m = 1.0 - 1e-7;

        x = DBL_MIN;
        p_ = pgamma(x, alpha, scale, lower_tail, log_p);

        if (lower_tail && p_ > p * _1_p || !lower_tail && p_ < p * _1_m) {
          return 0.0;
        }
      } else {
        p_ = pgamma(x, alpha, scale, lower_tail, log_p);
      }

      if (p_ === Number.NEGATIVE_INFINITY) {
        return 0;
      }
    }

    for (var i = 1; i <= max_it_Newton; i++) {
      p1 = p_ - p;

      if (Math.abs(p1) < Math.abs(EPS_N * p)) {
        break;
      }

      if ((g = dgamma(x, alpha, scale, log_p)) === R_D__0(log_p)) {
        break;
      }

      t = log_p ? p1 * Math.exp(p_ - g) : p1 / g;
      t = lower_tail ? x - t : x + t;
      p_ = pgamma(t, alpha, scale, lower_tail, log_p);

      if (Math.abs(p_ - p) > Math.abs(p1) || i > 1 && Math.abs(p_ - p) === Math.abs(p1)) {
        break;
      }
      /*
      // This code appears to be never triggered in R, or rather I'm unable to find where
      // Harmful_notably_if_max_it_Newton_is_1 is ever defined
      if (t > 1.1*x) { t = 1.1 * x; }
      else if (t < 0.9*x) { t = 0.9 * x; }
       */


      x = t;
    }

    return x;
  }

  ch = qchisq_appr(p, 2 * alpha, g, lower_tail, log_p, EPS1);

  if (!isFinite(ch)) {
    max_it_Newton = 0;
    return end();
  }

  if (ch < EPS2) {
    max_it_Newton = 20;
    return end();
  }

  if (p_ > pMAX || p_ < pMIN) {
    max_it_Newton = 20;
    return end();
  }

  c = alpha - 1;
  s6 = (120 + c * (346 + 127 * c)) * i5040;
  ch0 = ch;

  for (var i = 1; i <= MAXIT; i++) {
    q = ch;
    p1 = 0.5 * ch;
    p2 = p_ - pgamma_raw(p1, alpha, true, false);

    if (!isFinite(p2) || ch <= 0) {
      ch = ch0;
      max_it_Newton = 27;
      return end();
    }

    t = p2 * Math.exp(alpha * M_LN2 + g + p1 - c * Math.log(ch));
    b = t / ch;
    a = 0.5 * t - b * c;
    s1 = (210 + a * (140 + a * (105 + a * (84 + a * (70 + 60 * a))))) * i420;
    s2 = (420 + a * (735 + a * (966 + a * (1141 + 1278 * a)))) * i2520;
    s3 = (210 + a * (462 + a * (707 + 932 * a))) * i2520;
    s4 = (252 + a * (672 + 1182 * a) + c * (294 + a * (889 + 1740 * a))) * i5040;
    s5 = (84 + 2264 * a + c * (1175 + 606 * a)) * i2520;
    ch += t * (1 + 0.5 * t * s1 - b * c * (s1 - b * (s2 - b * (s3 - b * (s4 - b * (s5 - b * s6))))));

    if (Math.abs(q - ch) < EPS2 * ch) {
      return end();
    }

    if (Math.abs(q - ch) > 0.1 * ch) {
      if (ch < q) {
        ch = 0.9 * q;
      } else {
        ch = 1.1 * q;
      }
    }
  }

  return end();
}
/**
 * Inverse CDF / quantile function for chi-squared distribution.
 * @param p
 * @param df
 * @param lower_tail
 * @param log_p
 * @return {*|number}
 */

function qchisq(p, df) {
  var ncp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var lower_tail = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var log_p = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  if (ncp !== 0) {
    throw 'Non-central chi-squared not yet supported';
  }

  return qgamma(p, 0.5 * df, 2.0, lower_tail, log_p);
}

function pnorm_both(x, i_tail, log_p) {
  var cum, ccum;
  var xden, xnum, temp, del, eps, xsq, y;
  var i, lower, upper;
  var a = PNORM_A,
      b = PNORM_B,
      c = PNORM_C,
      d = PNORM_D,
      p = PNORM_P,
      q = PNORM_Q;

  if (isNaN(x)) {
    return {
      cum: NaN,
      ccum: NaN
    };
  }

  eps = DBL_EPSILON * 0.5;
  lower = i_tail != 1;
  upper = i_tail != 0;
  y = Math.abs(x);

  if (y <= 0.67448975) {
    if (y > eps) {
      xsq = x * x;
      xnum = a[4] * xsq;
      xden = xsq;

      for (i = 0; i < 3; ++i) {
        xnum = (xnum + a[i]) * xsq;
        xden = (xden + b[i]) * xsq;
      }
    } else {
      xnum = xden = 0.0;
    }

    temp = x * (xnum + a[3]) / (xden + b[3]);

    if (lower) {
      cum = 0.5 + temp;
    }

    if (upper) {
      ccum = 0.5 - temp;
    }

    if (log_p) {
      if (lower) {
        cum = Math.log(cum);
      }

      if (upper) {
        ccum = Math.log(ccum);
      }
    }
  } else if (y <= M_SQRT_32) {
    xnum = c[8] * y;
    xden = y;

    for (i = 0; i < 7; ++i) {
      xnum = (xnum + c[i]) * y;
      xden = (xden + d[i]) * y;
    }

    temp = (xnum + c[7]) / (xden + d[7]); //do del (x)

    xsq = Math.trunc(y * 16) / 16;
    del = (y - xsq) * (y + xsq);

    if (log_p) {
      cum = -xsq * xsq * 0.5 + -del * 0.5 + Math.log(temp);

      if (lower && x > 0.0 || upper && x <= 0.0) {
        ccum = Math.log1p(-Math.exp(-xsq * xsq * 0.5) * Math.exp(-del * 0.5) * temp);
      }
    } else {
      cum = Math.exp(-xsq * xsq * 0.5) * Math.exp(-del * 0.5) * temp;
      ccum = 1.0 - cum;
    } //swap tail


    if (x > 0.) {
      temp = cum;

      if (lower) {
        cum = ccum;
      }

      ccum = temp;
    }
  } else if (log_p && y < 1e170 || lower && -37.5193 < x && x < 8.2924 || upper && -8.2924 && x < 37.5193) {
    xsq = 1.0 / (x * x);
    xnum = p[5] * xsq;
    xden = xsq;

    for (i = 0; i < 4; ++i) {
      xnum = (xnum + p[i]) * xsq;
      xden = (xden + q[i]) * xsq;
    }

    temp = xsq * (xnum + p[4]) / (xden + q[4]);
    temp = (M_1_SQRT_2PI - temp) / y; //do del(x)

    xsq = Math.trunc(x * 16) / 16;
    del = (x - xsq) * (x + xsq);

    if (log_p) {
      cum = -xsq * xsq * 0.5 + -del * 0.5 + Math.log(temp);

      if (lower && x > 0.0 || upper && x <= 0.0) {
        ccum = Math.log1p(-Math.exp(-xsq * xsq * 0.5) * Math.exp(-del * 0.5) * temp);
      }
    } else {
      cum = Math.exp(-xsq * xsq * 0.5) * Math.exp(-del * 0.5) * temp;
      ccum = 1.0 - cum;
    } //swap tail


    if (x > 0.) {
      temp = cum;

      if (lower) {
        cum = ccum;
      }

      ccum = temp;
    }
  } else {
    if (x > 0) {
      cum = R_D(1, log_p);
      ccum = R_D(0, log_p);
    } else {
      cum = R_D(0, log_p);
      ccum = R_D(1, log_p);
    }
  } //TODO left off here


  return {
    cum: cum,
    ccum: ccum
  };
}

function pnorm(x, mu, sigma, lower_tail, log_p) {
  var p;

  if (isNaN(x) || isNaN(mu) || isNaN(sigma)) {
    return NaN;
  }

  if (!Number.isFinite(x) && mu === x) {
    return NaN;
  }

  if (sigma <= 0) {
    if (sigma < 0) {
      return NaN;
    }

    return x < mu ? R_DT_0(lower_tail, log_p) : R_DT_1(lower_tail, log_p);
  }

  p = (x - mu) / sigma;

  if (!Number.isFinite(p)) {
    return x < mu ? R_DT_0(lower_tail, log_p) : R_DT_1(lower_tail, log_p);
  }

  x = p;
  var r = pnorm_both(x, lower_tail ? 0 : 1, log_p);
  return lower_tail ? r.cum : r.ccum;
}
/**
 * The normal cumulative distribution function.
 *
 * @function pnorm
 * @param x {number} Value.
 * @param mu {number} Mean of the normal distribution.
 * @param sigma {number} Standard deviation of the normal distribution.
 * @param lower_tail {boolean} Should the cumulative probability returned be calculated as the lower tail?
 * @param give_log {boolean} Return log probability
 */


function _pnorm(x, mu, sigma, lower_tail, give_log) {
  x = parseNumeric(x);
  mu = parseNumeric(mu, 0);
  sigma = parseNumeric(sigma, 1);
  lower_tail = parseBoolean(lower_tail, true);
  give_log = parseBoolean(give_log, false);
  return pnorm(x, mu, sigma, lower_tail, give_log);
}



function dnorm(x, mu, sigma, give_log) {
  if (isNaN(x) || isNaN(mu) || isNaN(sigma)) {
    return x + mu + sigma;
  }

  if (!Number.isFinite(sigma)) {
    return R_D(0, give_log);
  }

  if (!Number.isFinite(x) && mu == x) {
    return NaN;
  }

  if (sigma <= 0) {
    if (sigma < 0) {
      return NaN;
    }

    return x == mu ? Number.POSITIVE_INFINITY : R_D(0, give_log);
  }

  x = (x - mu) / sigma;

  if (!Number.isFinite(x)) {
    return R_D(0, give_log);
  }

  x = Math.abs(x);

  if (x >= 2 * Math.sqrt(DBL_MAX)) {
    return R_D(0, give_log);
  }

  if (give_log) {
    return -(M_LN_SQRT_2PI + 0.5 * x * x + Math.log(sigma));
  } //fast version


  return M_1_SQRT_2PI * Math.exp(-0.5 * x * x) / sigma;
}

function lbeta(a, b) {
  var corr, p, q;
  p = q = a;
  if (b < p) p = b;
  if (b > q) q = b;

  if (p < 0) {
    return ML_ERR_return_NAN();
  } else if (p === 0) {
    return Number.POSITIVE_INFINITY;
  } else if (!isFinite(q)) {
    return Number.NEGATIVE_INFINITY;
  }

  if (p >= 10) {
    corr = lgammacor(p) + lgammacor(q) - lgammacor(p + q);
    return Math.log(q) * -0.5 + M_LN_SQRT_2PI + corr + (p - 0.5) * Math.log(p / (p + q)) + q * Math.log1p(-p / (p + q));
  } else if (q >= 10) {
    corr = lgammacor(q) - lgammacor(p + q);
    return lgammafn(p) + corr + p - p * Math.log(p + q) + (q - 0.5) * Math.log1p(-p / (p + q));
  } else {
    if (p < 1e-306) return lgammafn(p) + (lgammafn(q) - lgammafn(p + q));else return Math.log(gammafn(p) * (gammafn(q) / gammafn(p + q)));
  }
}

function dbinom_raw(x, n, p, q, give_log) {
  var lf, lc;
  if (p === 0) return x === 0 ? R_D__1(give_log) : R_D__0(give_log);
  if (q === 0) return x === n ? R_D__1(give_log) : R_D__0(give_log);

  if (x === 0) {
    if (n === 0) return R_D__1(give_log);
    lc = p < 0.1 ? -bd0(n, n * q) - n * p : n * Math.log(q);
    return R_D_exp(lc, give_log);
  }

  if (x === n) {
    lc = q < 0.1 ? -bd0(n, n * p) - n * q : n * Math.log(p);
    return R_D_exp(lc, give_log);
  }

  if (x < 0 || x > n) return R_D__0(give_log);
  lc = stirlerr(n) - stirlerr(x) - stirlerr(n - x) - bd0(x, n * p) - bd0(n - x, n * q);
  lf = M_LN_2PI + Math.log(x) + Math.log1p(-x / n);
  return R_D_exp(lc - 0.5 * lf, give_log);
}

function dbeta(x, a, b, give_log) {
  if (a < 0 || b < 0) ML_ERR_return_NAN();
  if (x < 0 || x > 1) return R_D__0(give_log);

  if (a === 0 || b === 0 || !isFinite(a) || !isFinite(b)) {
    if (a === 0 && b === 0) {
      if (x === 0 || x === 1) return Number.POSITIVE_INFINITY;else return R_D__0(give_log);
    }

    if (a === 0 || a / b === 0) {
      if (x === 0) return Number.POSITIVE_INFINITY;else return R_D__0(give_log);
    }

    if (b === 0 || b / a === 0) {
      if (x === 1) return Number.POSITIVE_INFINITY;else return R_D__0(give_log);
    }

    if (x === 0.5) return Number.POSITIVE_INFINITY;else return R_D__0(give_log);
  }

  if (x === 0) {
    if (a > 1) return R_D__0(give_log);
    if (a < 1) return Number.POSITIVE_INFINITY;
    return R_D_val(b, give_log);
  }

  if (x === 1) {
    if (b > 1) return R_D__0(give_log);
    if (b < 1) return Number.POSITIVE_INFINITY;
    return R_D_val(a, give_log);
  }

  var lval;

  if (a <= 2 || b <= 2) {
    lval = (a - 1) * Math.log(x) + (b - 1) * Math.log1p(-x) - lbeta(a, b);
  } else {
    lval = Math.log(a + b - 1) + dbinom_raw(a - 1, a + b - 2, x, 1 - x, true);
  }

  return R_D_exp(lval, give_log);
}
/**
 * The beta density function.
 *
 * The non-central beta distribution parameter is not implemented currently.
 *
 * @function dbeta
 * @param x {number} Value.
 * @param shape1 {number} The first shape parameter, or "alpha."
 * @param shape2 {number} The second shape parameter, or "beta."
 * @param log {boolean} Should the result be returned in log scale.
 * @return {number} Probability density evaluated at x.
 */


function _dbeta(x, shape1, shape2, log) {
  x = parseNumeric(x);
  shape1 = parseNumeric(shape1);
  shape2 = parseNumeric(shape2); //ncp = parseNumeric(ncp, 0);

  log = parseBoolean(log, false);
  return dbeta(x, shape1, shape2, log);
}



function parseNumeric(x, default_value) {
  if (typeof x === "undefined") {
    return default_value;
  }

  return +x;
}

function parseBoolean(x, default_value) {
  if (typeof x === "undefined") {
    return default_value;
  }

  return !!((x || "false") != "false");
} // Will slowly roll this into export statements as-needed
// const rollup = {
//   dnorm: function (x, mu, sigma, give_log) {
//     x = +x;
//     mu = parseNumeric(mu, 0);
//     sigma = parseNumeric(sigma, 1);
//     give_log = parseBoolean(give_log, false);
//     return dnorm(x, mu, sigma, give_log);
//   },
//   pnorm: function (x, mu, sigma, lower_tail, give_log) {
//     x = parseNumeric(x);
//     mu = parseNumeric(mu, 0);
//     sigma = parseNumeric(sigma, 1);
//     lower_tail = parseBoolean(lower_tail, true);
//     give_log = parseBoolean(give_log, false);
//     return pnorm(x, mu, sigma, lower_tail, give_log);
//   },
//   pchisq: function (x, df, ncp, lower_tail, give_log) {
//     x = parseNumeric(x);
//     df = parseNumeric(df);
//     ncp = parseNumeric(ncp,0);
//     lower_tail = parseBoolean(lower_tail, true);
//     give_log = parseBoolean(give_log, false);
//     return pchisq(x, df, ncp, lower_tail, give_log);
//   },
//   pgamma: function (q, shape, scale, lower_tail, give_log) {
//     q = parseNumeric(q);
//     shape = parseNumeric(shape);
//     scale = parseNumeric(scale, 1);
//     lower_tail = parseBoolean(lower_tail, true);
//     give_log = parseBoolean(give_log, false);
//     return pgamma(q, shape, scale, lower_tail, give_log);
//   },
//   dpois: function (x, lambda, log) {
//     x = parseNumeric(x);
//     lambda = parseNumeric(lambda);
//     log = parseBoolean(log, false);
//     return dpois(x, lambda, log);
//   }
// };
// CONCATENATED MODULE: ./src/app/stats.js








/**
 * Calculate group-based tests from score statistics.
 *
 * @module stats
 * @license MIT
 */





 // Functions using WASM will be defined inside a single promise- sort of a meta-module
//   Because the webassembly code is loaded asynchronously, anything using any module method will need to be
//   resolved asynchronously as well.

var MVT_WASM_HELPERS = new Promise(function (resolve, reject) {
  // The emscripten "module" doesn't return a true promise, so it can't be chained in the traditional sense.
  // This syntax is a hack that allows us to wrap the wasm module with our helper functions and access those helpers.
  try {
    Object(mvtdstpack["a" /* default */])().then(function (module) {
      function makeDoubleVec(size) {
        var v = new module.DoubleVec();
        v.resize(size, NaN);
        return v;
      }

      function makeIntVec(size) {
        var v = new module.IntVec();
        v.resize(size, NaN);
        return v;
      }

      function copyToDoubleVec(arr) {
        var constructor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : module.DoubleVec;
        var v = new constructor();

        for (var i = 0; i < arr.length; i++) {
          v.push_back(arr[i]);
        }

        return v;
      }

      function pmvnorm(lower, upper, mean, sigma) {
        var n = sigma.length;
        var infin = makeIntVec(n);
        var delta = makeDoubleVec(n);
        var corrF = makeDoubleVec(n * (n - 1) / 2);
        var corr = cov2cor(sigma); // Populate corrF

        for (var j = 0; j < n; j++) {
          for (var i = j + 1; i < n; i++) {
            var k = j + 1 + (i - 1) * i / 2 - 1;
            corrF.set(k, corr[i][j]);
          }
        } // Calculate limits


        for (var _i = 0; _i < n; _i++) {
          delta.set(_i, 0.0);

          if (lower[_i] !== Infinity && lower[_i] !== -Infinity) {
            lower[_i] = (lower[_i] - mean[_i]) / Math.sqrt(sigma[_i][_i]);
          }

          if (upper[_i] !== Infinity && upper[_i] !== -Infinity) {
            upper[_i] = (upper[_i] - mean[_i]) / Math.sqrt(sigma[_i][_i]);
          }

          if (lower[_i] === -Infinity) {
            infin.set(_i, 0);
          }

          if (upper[_i] === Infinity) {
            infin.set(_i, 1);
          }

          if (lower[_i] === -Infinity && upper[_i] === Infinity) {
            infin.set(_i, -1);
          }

          if (lower[_i] !== -Infinity && upper[_i] !== Infinity) {
            infin.set(_i, 2);
          }

          if (lower[_i] === -Infinity) {
            lower[_i] = 0;
          }

          if (upper[_i] === Infinity) {
            upper[_i] = 0;
          }
        }

        var inform = 0;
        var value = 0.0;
        var error = 0.0;
        var df = 0;
        var maxpts = 50000;
        var abseps = 0.001;
        var releps = 0.0;
        var sum = 0;

        for (var _i2 = 0; _i2 < n; _i2++) {
          sum += infin.get(_i2);
        }

        if (sum === -n) {
          inform = 0;
          value = 1.0;
        } else {
          var _module$mvtdst = module.mvtdst(n, df, copyToDoubleVec(lower), copyToDoubleVec(upper), infin, corrF, delta, maxpts, abseps, releps);

          error = _module$mvtdst.error;
          inform = _module$mvtdst.inform;
          value = _module$mvtdst.value;
        }

        if (inform === 3) {
          // Need to make correlation matrix positive definite
          var trial = 0;

          while (inform > 1 && trial < 100) {
            var eig = numeric_1_2_6_default.a.eig(corr, 100000);
            var lambdas = eig.lambda.x;

            for (var _i3 = 0; _i3 < n; _i3++) {
              if (lambdas[_i3] < 0) {
                lambdas[_i3] = 0.0;
              }
            }

            var D = numeric_1_2_6_default.a.diag(lambdas);
            var V = eig.E.x;
            corr = numeric_1_2_6_default.a.dot(numeric_1_2_6_default.a.dot(V, D), numeric_1_2_6_default.a.transpose(V));
            var corr_diag = Array(n);

            for (var _i4 = 0; _i4 < n; _i4++) {
              corr_diag[_i4] = corr[_i4][_i4];
            }

            var norm = numeric_1_2_6_default.a.dot(numeric_1_2_6_default.a.transpose([corr_diag]), [corr_diag]);

            for (var _j = 0; _j < n; _j++) {
              for (var _i5 = _j + 1; _i5 < n; _i5++) {
                var _k = _j + 1 + (_i5 - 1) * _i5 / 2 - 1;

                corrF.set(_k, corr[_i5][_j] / Math.sqrt(norm[_i5][_j]));
              }
            }

            var _module$mvtdst2 = module.mvtdst(n, df, copyToDoubleVec(lower), copyToDoubleVec(upper), infin, corrF, delta, maxpts, abseps, releps);

            error = _module$mvtdst2.error;
            inform = _module$mvtdst2.inform;
            value = _module$mvtdst2.value;
          }

          if (inform > 1) {
            value = -1.0;
          }
        }

        return {
          error: error,
          inform: inform,
          value: value
        };
      }

      var helper_module = {
        makeDoubleVec: makeDoubleVec,
        makeIntVec: makeIntVec,
        copyToDoubleVec: copyToDoubleVec,
        pmvnorm: pmvnorm
      };
      resolve(helper_module);
    });
  } catch (error) {
    reject(error);
  }
});

function emptyRowMatrix(nrows, ncols) {
  var m = new Array(nrows);

  for (var i = 0; i < nrows; i++) {
    m[i] = new Array(ncols).fill(NaN);
  }

  return m;
}

function cov2cor(sigma) {
  var corr = emptyRowMatrix(sigma.length, sigma[0].length);

  for (var i = 0; i < sigma.length; i++) {
    for (var j = i; j < sigma[0].length; j++) {
      if (i === j) {
        corr[i][j] = 1.0;
      } else {
        var v = sigma[i][j] / (Math.sqrt(sigma[i][i]) * Math.sqrt(sigma[j][j]));
        corr[i][j] = v;
        corr[j][i] = v;
      }
    }
  }

  return corr;
}

function get_conditional_dist(scores, cov, comb) {
  var result = new Array(2).fill(0.0);
  var mu2 = [];
  var dim = comb.length - 1;
  var sub_cov = emptyRowMatrix(dim, dim);

  for (var i = 0; i < dim; i++) {
    var idx1 = comb[i + 1];
    mu2[i] = scores[idx1];

    for (var j = 0; j < dim; j++) {
      var idx2 = comb[j + 1];
      sub_cov[i][j] = cov[idx1][idx2];
    }
  }

  var inv = numeric_1_2_6_default.a.inv(sub_cov);
  var sigma12 = new Array(dim).fill(NaN);

  for (var _i6 = 0; _i6 < dim; _i6++) {
    var _idx = comb[0];
    var _idx2 = comb[_i6 + 1];
    sigma12[_i6] = cov[_idx][_idx2];
  }

  var tmp = new Array(dim).fill(0.0);

  for (var _i7 = 0; _i7 < dim; _i7++) {
    tmp[_i7] += numeric_1_2_6_default.a.dot(sigma12, inv[_i7]);
  }

  result[0] = numeric_1_2_6_default.a.dot(tmp, mu2);
  result[1] = 1.0 - numeric_1_2_6_default.a.dot(tmp, sigma12);

  if (result[1] < 0) {
    result[1] = Math.abs(result[1]);
  }

  return result;
}
/**
 * Calculates MVT p-value directly from scores/covariance and maximum test statistic.
 * TODO: ask Shaung or Goncalo where this comes from?
 * @param scores
 * @param cov_t
 * @param t_max
 * @return {*|number}
 */


function calculate_mvt_pvalue(scores, cov_t, t_max) {
  var pvalue = 0.0;
  var dim = scores.length;
  var chisq = t_max * t_max;
  var jointProbHash = {};

  if (dim === 1) {
    pvalue = pchisq(chisq, 1, 0, 0);
    return pvalue;
  }

  var uni = pchisq(chisq, 1, 0, 0);
  pvalue += dim * uni;
  var indx = [];

  var alpha = toConsumableArray_default()(Array(dim).keys()); // 0, 1, 2, 3... dim


  for (var r = 2; r <= dim; r++) {
    var j = r;
    var k = r;
    var comb = [];
    var par = [];

    for (var twk = j; twk <= k; twk++) {
      var _r = twk;
      var done = true;

      for (var iwk = 0; iwk < _r; iwk++) {
        indx.push(iwk);
      }

      while (done) {
        done = false;

        for (var owk = 0; owk < _r; owk++) {
          comb.push(alpha[indx[owk]]);
        }

        par = get_conditional_dist(scores, cov_t, comb);

        var _chisq = void 0,
            condProb = void 0,
            prob = void 0;

        if (par[1] === 0.0) {
          condProb = 0.0;
        } else {
          _chisq = (t_max - par[0]) * (t_max - par[0]) / par[1];

          if (_chisq < 0) {
            _chisq = -_chisq;
          }

          condProb = pchisq(_chisq, 1, 0, 0);
        }

        var hashKey = "";

        if (_r === 2) {
          hashKey += comb[0];
          hashKey += comb[1];
          prob = condProb * uni;
          jointProbHash[hashKey] = prob;
          hashKey = "";
        } else {
          for (var i = 1; i < _r; i++) {
            hashKey += comb[i];
          }

          prob = jointProbHash[hashKey];
          prob *= condProb;
          var newKey = "";
          newKey += comb[0];
          newKey += hashKey;
          jointProbHash[newKey] = prob;
          hashKey = "";
        }

        pvalue -= prob;
        comb = [];

        for (var _iwk = _r - 1; _iwk >= 0; _iwk--) {
          if (indx[_iwk] <= dim - 1 - (_r - _iwk)) {
            indx[_iwk]++;

            for (var swk = _iwk + 1; swk < _r; swk++) {
              indx[swk] = indx[swk - 1] + 1;
            }

            _iwk = -1;
            done = true;
          }
        }
      }

      indx = [];
    }
  }

  return pvalue;
}
/**
 * Base class for all aggregation tests.
 */


var stats_AggregationTest =
/*#__PURE__*/
function () {
  function AggregationTest() {
    classCallCheck_default()(this, AggregationTest);

    this.label = '';
    this.key = '';
    this.requiresMaf = false;
  }

  createClass_default()(AggregationTest, [{
    key: "run",
    value: function run(u, v, w, mafs) {
      // todo update docstrings and call sigs
      throw new Error("Method must be implemented in a subclass");
    }
  }]);

  return AggregationTest;
}();
/**
 * Standard burden test that collapses rare variants into a total count of rare alleles observed per sample
 * in a group (e.g. gene). <p>
 *
 * See {@link https://genome.sph.umich.edu/wiki/RAREMETAL_METHOD#BURDEN_META_ANALYSIS|our wiki page} for more information.
 * Also see the {@link https://www.ncbi.nlm.nih.gov/pubmed/19810025|paper} describing the method.
 *
 * @extends AggregationTest
 */


var stats_ZegginiBurdenTest =
/*#__PURE__*/
function (_AggregationTest) {
  inherits_default()(ZegginiBurdenTest, _AggregationTest);

  function ZegginiBurdenTest() {
    var _this;

    classCallCheck_default()(this, ZegginiBurdenTest);

    _this = possibleConstructorReturn_default()(this, getPrototypeOf_default()(ZegginiBurdenTest).apply(this, arguments));
    _this.key = 'burden';
    _this.label = 'Burden';
    return _this;
  }
  /**
   * Default weight function for burden test. All variants weighted equally. Only requires the number of variants
   * since they are all given the same weight value.
   * @param n {number} Number of variants.
   * @return {number[]} An array of weights, one per variant.
   */


  createClass_default()(ZegginiBurdenTest, [{
    key: "run",

    /**
     * Calculate burden test from vector of score statistics and variances.
     *
     * @param {Number[]} u Vector of score statistics (length m, number of variants)
     * @param {Number[]} v Covariance matrix of score statistics
     * @param {Number[]} w Weight vector (length m, number of variants)
     * @return {Number[]} Burden test statistic z and p-value
     */
    value: function run(u, v, w) {
      for (var _i8 = 0, _arr = [u, v]; _i8 < _arr.length; _i8++) {
        var e = _arr[_i8];

        if (!Array.isArray(e) || !e.length) {
          throw 'Please provide all required arrays';
        }
      }

      if (!(u.length === v.length)) {
        throw 'u and v must be same length';
      }

      if (w != null) {
        if (w.length !== u.length) {
          throw 'w vector must be same length as score vector u';
        }
      } else {
        w = ZegginiBurdenTest.weights(u.length);
      } // This is taken from:
      // https://genome.sph.umich.edu/wiki/RAREMETAL_METHOD#BURDEN_META_ANALYSIS


      var over = numeric_1_2_6_default.a.dot(w, u);
      var under = Math.sqrt(numeric_1_2_6_default.a.dot(numeric_1_2_6_default.a.dot(w, v), w));
      var z = over / under; // The -Math.abs(z) is because pnorm returns the lower tail probability from the normal dist
      // The * 2 is for a two-sided p-value.

      var p = _pnorm(-Math.abs(z), 0, 1) * 2;
      return [z, p];
    }
  }], [{
    key: "weights",
    value: function weights(n) {
      return new Array(n).fill(1 / n);
    }
  }]);

  return ZegginiBurdenTest;
}(stats_AggregationTest);

function _vt(maf_cutoffs, u, v, mafs) {
  // Calculate score statistic and cov weight matrix for each MAF cutoff.
  var cov_weight = emptyRowMatrix(maf_cutoffs.length, u.length);
  var t_max = -Infinity;
  var scores = Array(maf_cutoffs.length).fill(0.0);
  maf_cutoffs.map(function (m, i) {
    // Weight is 1 if MAF < cutoff, otherwise 0.
    var w = mafs.map(function (maf) {
      return maf <= m ? 1 : 0;
    });
    cov_weight[i] = w; // Calculate burden t-statistic for this maf cutoff

    var numer = numeric_1_2_6_default.a.dot(w, u);
    var denom = numeric_1_2_6_default.a.dot(numeric_1_2_6_default.a.dot(w, v), w);
    var t_stat = Math.abs(numer / Math.sqrt(denom));
    scores[i] = t_stat;

    if (t_stat > t_max) {
      t_max = t_stat;
    }
  }); // Did we calculate any valid scores?

  if (Math.max.apply(Math, toConsumableArray_default()(scores)) === 0.0) {
    throw 'No scores were able to be calculated for this group';
  } // Calculate covariance matrix


  var cov_u = numeric_1_2_6_default.a.dot(numeric_1_2_6_default.a.dot(cov_weight, v), numeric_1_2_6_default.a.transpose(cov_weight));
  var cov_t = cov2cor(cov_u);
  return [scores, cov_t, t_max];
}
/**
 * Variable threshold test (VT). <p>
 */


var stats_VTTest =
/*#__PURE__*/
function (_AggregationTest2) {
  inherits_default()(VTTest, _AggregationTest2);

  function VTTest() {
    var _this2;

    classCallCheck_default()(this, VTTest);

    _this2 = possibleConstructorReturn_default()(this, getPrototypeOf_default()(VTTest).apply(this, arguments));
    _this2.label = 'Variable Threshold';
    _this2.key = 'vt';
    _this2.requiresMaf = true;
    _this2._method = 'auto';
    return _this2;
  }
  /**
   * This code corresponds roughly to: https://github.com/statgen/raremetal/blob/2c82cfc5710dbd9fd56ef67a7ca5f74772d4e70d/raremetal/src/Meta.cpp#L3456
   * @param u
   * @param v
   * @param w This parameter is ignored for VT. Weights are calculated automatically from mafs.
   * @param mafs
   * @return Promise
   */


  createClass_default()(VTTest, [{
    key: "run",
    value: function run(u, v, w, mafs) {
      // Uses wasm, returns a promise
      if (w != null) {
        throw 'w vector is not accepted in with VT test';
      } // Figure out MAF cutoffs. This tries every possible MAF cutoff given a list of all MAFs.


      var maf_cutoffs = [];

      var sorted_mafs = toConsumableArray_default()(mafs).sort();

      for (var i = 0; i < mafs.length; i++) {
        if (sorted_mafs[i] > maf_cutoffs.slice(-1)) {
          maf_cutoffs.push(sorted_mafs[i]);
        }
      } // Try calculating scores/t-stat covariance the first time (may need refinement later).


      var _vt2 = _vt(maf_cutoffs, u, v, mafs),
          _vt3 = slicedToArray_default()(_vt2, 3),
          scores = _vt3[0],
          cov_t = _vt3[1],
          t_max = _vt3[2];

      var lower = new Array(maf_cutoffs.length).fill(-t_max);
      var upper = new Array(maf_cutoffs.length).fill(t_max);
      var mean = new Array(maf_cutoffs.length).fill(0);
      return MVT_WASM_HELPERS.then(function (module) {
        var result = module.pmvnorm(lower, upper, mean, cov_t);
        var pvalue;

        if (result.value === -1.0) {
          throw 'Error: correlation matrix is not positive semi-definite';
        } else if (result.value === 1.0) {
          // Use Shuang's algorithm
          if (maf_cutoffs.length > 20) {
            maf_cutoffs = maf_cutoffs.slice(-20);

            var _vt4 = _vt(maf_cutoffs, u, v, mafs),
                _vt5 = slicedToArray_default()(_vt4, 3),
                _scores = _vt5[0],
                _cov_t = _vt5[1],
                _t_max = _vt5[2];

            pvalue = calculate_mvt_pvalue(_scores, _cov_t, _t_max);
          } else {
            pvalue = calculate_mvt_pvalue(scores, cov_t, t_max);
          }
        } else {
          pvalue = 1.0 - result.value;
        }

        if (pvalue > 1.0) {
          pvalue = 1.0;
        }

        return [t_max, pvalue];
      });
    }
  }]);

  return VTTest;
}(stats_AggregationTest);
/**
 * Sequence kernel association test (SKAT). <p>
 *
 * See the {@link https://www.cell.com/ajhg/fulltext/S0002-9297%2811%2900222-9|original paper} for details on the
 * method, and {@link https://genome.sph.umich.edu/wiki/RAREMETAL_METHOD#SKAT_META_ANALYSIS|our wiki} for information
 * on how the test is calculated using scores/covariances. <p>
 *
 * @extends AggregationTest
 */


var stats_SkatTest =
/*#__PURE__*/
function (_AggregationTest3) {
  inherits_default()(SkatTest, _AggregationTest3);

  function SkatTest() {
    var _this3;

    classCallCheck_default()(this, SkatTest);

    _this3 = possibleConstructorReturn_default()(this, getPrototypeOf_default()(SkatTest).apply(this, arguments));
    _this3.label = 'SKAT';
    _this3.key = 'skat';
    _this3.requiresMaf = true;
    /**
     * Skat test method. Only used for dev/testing.
     * Should not be set by user.
     * @private
     * @type {string}
     */

    _this3._method = 'auto';
    return _this3;
  }
  /**
   * Calculate typical SKAT weights using beta density function.
   *
   * @function
   * @param mafs {number[]} Array of minor allele frequencies.
   * @param a {number} alpha defaults to 1.
   * @param b {number} beta defaults to 25.
   */


  createClass_default()(SkatTest, [{
    key: "run",

    /**
     * Calculate SKAT test. <p>
     *
     * The distribution function of the SKAT test statistic is evaluated using Davies' method by default.
     * In the special case where there is only 1 lambda, the Liu moment matching approximation method is used. <p>
     *
     * @function
     * @param {Number[]} u Vector of score statistics (length m, number of variants).
     * @param {Number[]} v Covariance matrix of score statistics (m x m).
     * @param {Number[]} w Weight vector (length m, number of variants). If weights are not provided, they will
     *  be calculated using the default weights() method of this object.
     * @param {Number[]} mafs A vector of minor allele frequencies. These will be used to calculate weights if
     *  they were not provided.
     * @return {Number[]} SKAT p-value.
     */
    value: function run(u, v, w, mafs) {
      // Calculate weights (if necessary)
      if (w === undefined || w === null) {
        w = SkatTest.weights(mafs);
      } // Calculate Q


      var q = numeric_1_2_6_default.a.dot(numeric_1_2_6_default.a.dot(u, numeric_1_2_6_default.a.diag(w)), u);
      /**
       * Code to calculate eigenvalues from V^(1/2) * W * V^(1/2)
       * This first decomposes V = U * S * U' (SVD on symmetric normal matrix results in this, instead of U * S * V').
       * If we take sqrt(S), then U * sqrt(S) * U' is a square root of the original matrix V. For a diagonal matrix,
       * sqrt(S) is just the sqrt(s_i) of each individual diagonal element.
       * Then we just take the dot product of (U * sqrt(S) * U') * W * (U * sqrt(S) * U'), which is V^(1/2) * W * V^(1/2).
       * Finally we compute SVD of that matrix, and take the singular values as the eigenvalues.
       */

      var lambdas;

      try {
        var svd = numeric_1_2_6_default.a.svd(v);
        var sqrtS = numeric_1_2_6_default.a.sqrt(svd.S);
        var uT = numeric_1_2_6_default.a.transpose(svd.U);
        var eigenRhs = numeric_1_2_6_default.a.dot(numeric_1_2_6_default.a.dot(svd.U, numeric_1_2_6_default.a.diag(sqrtS)), uT);
        var eigenLhs = numeric_1_2_6_default.a.dot(eigenRhs, numeric_1_2_6_default.a.diag(w));
        var eigen = numeric_1_2_6_default.a.dot(eigenLhs, eigenRhs);
        var finalSvd = numeric_1_2_6_default.a.svd(eigen);
        lambdas = numeric_1_2_6_default.a.abs(finalSvd.S);
      } catch (error) {
        console.log(error);
        return [NaN, NaN];
      }

      if (numeric_1_2_6_default.a.sum(lambdas) < 0.0000000001) {
        console.error("Sum of lambda values for SKAT test is essentially zero");
        return [NaN, NaN];
      } // P-value method


      if (this._method === 'liu') {
        // Only for debug purposes
        return _skatLiu(lambdas, q);
      } else if (this._method === 'davies') {
        return _skatDavies(lambdas, q);
      } else if (this._method === 'auto') {
        if (lambdas.length === 1) {
          // Davies method does not support 1 lambda
          // This is what raremetal does
          return _skatLiu(lambdas, q);
        } else {
          var daviesResult = _skatDavies(lambdas, q);

          if (isNaN(daviesResult[1])) {
            // Davies' method could not converge. Use R-SKAT's approach instead.
            return _skatLiu(lambdas, q);
          } else {
            return daviesResult;
          }
        }
      } else {
        throw new Error("Skat method ".concat(this._method, " not implemented"));
      }
    }
  }], [{
    key: "weights",
    value: function weights(mafs) {
      var a = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 25;
      var weights = Array(mafs.length).fill(null);

      for (var i = 0; i < mafs.length; i++) {
        var w = _dbeta(mafs[i], a, b, false);
        w *= w;
        weights[i] = w;
      }

      return weights;
    }
  }]);

  return SkatTest;
}(stats_AggregationTest);
/**
 * Calculate SKAT p-value using Davies method.
 * @function
 * @param lambdas Eigenvalues of sqrtV * W * sqrtV.
 * @param qstat SKAT test statistic U.T * W * U.
 * @return {Number[]} Array of [Q statistic, p-value].
 * @private
 */


function _skatDavies(lambdas, qstat) {
  /**
   * lambdas - coefficient of jth chi-squared variable
   * nc1 - non-centrality parameters
   * n1 - degrees of freedom
   * n - number of chi-squared variables
   * sigma - coefficient of standard normal variable
   * qstat - point at which cdf is to be evaluated (this is SKAT Q stat usually)
   * lim1 - max number of terms in integration
   * acc - maximum error
   * trace - array into which the following is stored:
   *   trace[0]	absolute sum
   *   trace[1]	total number of integration terms
   *   trace[2]	number of integrations
   *   trace[3]	integration interval in final integration
   *   trace[4]	truncation point in initial integration
   *   trace[5]	s.d. of initial convergence factor
   *   trace[6]	cycles to locate integration parameters
   * ifault - array into which the following fault codes are stored:
   *   0 normal operation
   *   1 required accuracy not achieved
   *   2 round-off error possibly significant
   *   3 invalid parameters
   *   4 unable to locate integration parameters
   *   5 out of memory
   * res - store final value into this variable
   */
  var n = lambdas.length;
  var nc1 = Array(n).fill(0);
  var n1 = Array(n).fill(1);
  var sigma = 0.0;
  var lim1 = 10000;
  var acc = 0.0001;
  var res = qf(lambdas, nc1, n1, n, sigma, qstat, lim1, acc);
  var qfval = res[0];
  var pval = 1.0 - qfval;
  var converged = res[1] === 0 && pval > 0 && pval <= 1;

  if (!converged) {
    pval = NaN;
  }

  return [qstat, pval];
}
/**
 * Calculate SKAT p-value using Liu method.
 * @param lambdas Eigenvalues of sqrtV * W * sqrtV.
 * @param qstat SKAT test statistic U.T * W * U.
 * @return {Number[]} [qstat, pvalue]
 * @private
 */


function _skatLiu(lambdas, qstat) {
  var n = lambdas.length;

  var _Array$fill = Array(4).fill(0.0),
      _Array$fill2 = slicedToArray_default()(_Array$fill, 4),
      c1 = _Array$fill2[0],
      c2 = _Array$fill2[1],
      c3 = _Array$fill2[2],
      c4 = _Array$fill2[3];

  for (var i = 0; i < n; i++) {
    var ilambda = lambdas[i];
    c1 += ilambda;
    c2 += ilambda * ilambda;
    c3 += ilambda * ilambda * ilambda;
    c4 += ilambda * ilambda * ilambda * ilambda;
  }

  var s1 = c3 / Math.sqrt(c2 * c2 * c2);
  var s2 = c4 / (c2 * c2);
  var muQ = c1;
  var sigmaQ = Math.sqrt(2.0 * c2);
  var tStar = (qstat - muQ) / sigmaQ;
  var delta, l, a;

  if (s1 * s1 > s2) {
    a = 1.0 / (s1 - Math.sqrt(s1 * s1 - s2));
    delta = s1 * a * a * a - a * a;
    l = a * a - 2.0 * delta;
  } else {
    a = 1.0 / s1;
    delta = 0.0;
    l = c2 * c2 * c2 / (c3 * c3);
  }

  var muX = l + delta;
  var sigmaX = Math.sqrt(2.0) * a;
  var qNew = tStar * sigmaX + muX;
  var p;

  if (delta === 0) {
    p = pchisq(qNew, l, 0, 0);
  } else {
    // Non-central chi-squared
    p = pchisq(qNew, l, delta, 0, 0);
  }

  return [qstat, p];
}

function getEigen(m) {
  var lambdas = numeric_1_2_6_default.a.eig(m, 1000000).lambda.x.sort(function (a, b) {
    return a - b;
  });
  var n = lambdas.length;
  var numNonZero = 0;
  var sumNonZero = 0.0;

  for (var i = 0; i < n; i++) {
    if (lambdas[i] > 0) {
      numNonZero++;
      sumNonZero += lambdas[i];
    }
  }

  if (numNonZero === 0) {
    throw new Error("All eigenvalues were 0 when calculating SKAT-O test");
  }

  var t = sumNonZero / numNonZero / 100000;
  var numKeep = n;

  for (var _i9 = 0; _i9 < n; _i9++) {
    if (lambdas[_i9] < t) {
      numKeep--;
    } else {
      break;
    }
  }

  var keep = new Array(numKeep).fill(null);

  for (var _i10 = 0; _i10 < numKeep; _i10++) {
    keep[_i10] = lambdas[n - 1 - _i10];
  }

  return keep;
}

function getMoment(lambdas) {
  var c = new Array(4).fill(NaN);
  c[0] = numeric_1_2_6_default.a.sum(lambdas);
  c[1] = numeric_1_2_6_default.a.sum(numeric_1_2_6_default.a.pow(lambdas, 2));
  c[2] = numeric_1_2_6_default.a.sum(numeric_1_2_6_default.a.pow(lambdas, 3));
  c[3] = numeric_1_2_6_default.a.sum(numeric_1_2_6_default.a.pow(lambdas, 4));
  var muQ = c[0];
  var sigmaQ = Math.sqrt(2 * c[1]);
  var s1 = c[2] / c[1] / Math.sqrt(c[1]);
  var s2 = c[3] / (c[1] * c[1]);
  var a, d, l;

  if (s1 * s1 > s2) {
    a = 1 / (s1 - Math.sqrt(s1 * s1 - s2));
    d = s1 * a - a * a;
    l = a * a - 2 * d;
  } else {
    l = 1.0 / s2;
  }

  var varQ = sigmaQ * sigmaQ;
  var df = l;
  return {
    muQ: muQ,
    varQ: varQ,
    df: df
  };
}

function getPvalByMoment(q, m) {
  var qNorm = (q - m.muQ) / Math.sqrt(m.varQ) * Math.sqrt(2.0 * m.df) + m.df;
  return pchisq(qNorm, m.df, 0, false, false);
}

function getQvalByMoment(min_pval, m) {
  var q_org = qchisq(min_pval, m.df, 0, false, false);
  return (q_org - m.df) / Math.sqrt(2.0 * m.df) * Math.sqrt(m.varQ) + m.muQ;
}

var stats_SkatIntegrator =
/*#__PURE__*/
function () {
  function SkatIntegrator(rhos, lambda, Qs_minP, taus, MuQ, VarQ, VarZeta, Df) {
    classCallCheck_default()(this, SkatIntegrator);

    this.rhos = rhos;
    this.lambda = lambda;
    this.Qs_minP = Qs_minP;
    this.taus = taus;
    this.MuQ = MuQ;
    this.VarQ = VarQ;
    this.VarZeta = VarZeta;
    this.Df = Df;
    this.gkPoints = 21;
    this.gkDepth = 30;
    this.gkError = Math.pow(Number.EPSILON, 0.25);
  }

  createClass_default()(SkatIntegrator, [{
    key: "setIntegrationParams",
    value: function setIntegrationParams(points, depth, error) {
      this.gkPoints = points;
      this.gkDepth = depth;
      this.gkError = error;
    }
  }, {
    key: "integrandDavies",
    value: function integrandDavies(x) {
      var kappa = Number.MAX_VALUE;
      var nRho = this.rhos.length;

      for (var i = 0; i < nRho; i++) {
        var v = (this.Qs_minP[i] - this.taus[i] * x) / (1.0 - this.rhos[i]);

        if (i === 0) {
          kappa = v;
        }

        if (v < kappa) {
          kappa = v;
        }
      }

      var temp;

      if (kappa > numeric_1_2_6_default.a.sum(this.lambda) * 10000) {
        temp = 0.0;
      } else {
        var Q = (kappa - this.MuQ) * Math.sqrt(this.VarQ - this.VarZeta) / Math.sqrt(this.VarQ) + this.MuQ;
        temp = SkatIntegrator.pvalueDavies(Q, this.lambda);

        if (temp <= 0.0 || temp === 1.0) {
          temp = SkatIntegrator.pvalueLiu(Q, this.lambda);
        }
      }

      var _final = (1.0 - temp) * dchisq(x, 1); //console.log("integrandDavies: ", x, temp, final);


      return _final;
    }
  }, {
    key: "integrandLiu",
    value: function integrandLiu(x) {
      var kappa = Number.MAX_VALUE;
      var nRho = this.rhos.length;

      for (var i = 0; i < nRho; i++) {
        var v = (this.Qs_minP[i] - this.taus[i] * x) / (1.0 - this.rhos[i]);

        if (v < kappa) {
          kappa = v;
        }
      }

      var Q = (kappa - this.MuQ) / Math.sqrt(this.VarQ) * Math.sqrt(2.0 * this.Df) + this.Df;
      var ret;

      if (Q <= 0) {
        ret = 0;
      } else {
        ret = pchisq(Q, this.Df) * dchisq(x, 1);
      }

      return ret;
    }
  }, {
    key: "_debugWriteIntegrandDavies",
    value: function _debugWriteIntegrandDavies(fpath) {
      var xstart = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var xend = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 40;
      var increment = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.001;

      var fs = __webpack_require__(9);

      var stream = fs.createWriteStream(fpath);
      var v;

      for (var x = xstart; x < xend; x += increment) {
        v = this.integrandDavies(x);
        stream.write(x + "\t" + v + "\n");
      }
    }
  }, {
    key: "skatOptimalIntegral",
    value: function skatOptimalIntegral() {
      var integ = new quadrature_GaussKronrod(this.gkPoints, this.gkDepth, this.gkError); // Try integrating Davies first

      var result;

      try {
        result = integ.integrate(this.integrandDavies.bind(this), 0, 40);
      } catch (e1) {
        try {
          result = integ.integrate(this.integrandLiu.bind(this), 0, 40);
        } catch (e2) {
          console.error("Could not integrate Davies or Liu integrands (SKAT-O)");
          throw e2;
        }
      }

      return result[0];
    }
  }], [{
    key: "pvalueDavies",
    value: function pvalueDavies(q, lambdas) {
      var n = lambdas.length;
      var nc1 = Array(n).fill(0);
      var n1 = Array(n).fill(1);
      var sigma = 0.0;
      var lim1 = 10000;
      var acc = 0.0001;
      var res = qf(lambdas, nc1, n1, n, sigma, q, lim1, acc);
      var qfval = res[0];
      var fault = res[1];
      var pvalue = 1.0 - qfval;

      if (pvalue > 1.0) {
        pvalue = 1.0;
      }

      if (fault) {
        pvalue = -1.0;
      }

      return pvalue;
    }
  }, {
    key: "pvalueLiu",
    value: function pvalueLiu(q, lambdas) {
      var n = lambdas.length;

      var _Array$fill3 = Array(4).fill(0.0),
          _Array$fill4 = slicedToArray_default()(_Array$fill3, 4),
          c1 = _Array$fill4[0],
          c2 = _Array$fill4[1],
          c3 = _Array$fill4[2],
          c4 = _Array$fill4[3];

      for (var i = 0; i < n; i++) {
        var ilambda = lambdas[i];
        c1 += ilambda;
        c2 += ilambda * ilambda;
        c3 += ilambda * ilambda * ilambda;
        c4 += ilambda * ilambda * ilambda * ilambda;
      }

      var s1 = c3 / Math.sqrt(c2 * c2 * c2);
      var s2 = c4 / (c2 * c2);
      var muQ = c1;
      var sigmaQ = Math.sqrt(2.0 * c2);
      var tStar = (q - muQ) / sigmaQ;
      var delta, l, a;

      if (s1 * s1 > s2) {
        a = 1.0 / (s1 - Math.sqrt(s1 * s1 - s2));
        delta = s1 * a * a * a - a * a;
        l = a * a - 2.0 * delta;
      } else {
        a = 1.0 / s1;
        delta = 0.0;
        l = c2 * c2 * c2 / (c3 * c3);
      }

      var muX = l + delta;
      var sigmaX = Math.sqrt(2.0) * a;
      var qNew = tStar * sigmaX + muX;

      if (qNew < 0) {
        return 1;
      }

      var p;

      if (delta === 0) {
        p = pchisq(qNew, l, 0, 0);
      } else {
        // Non-central chi-squared
        p = pchisq(qNew, l, delta, 0, 0);
      }

      return p;
    }
  }]);

  return SkatIntegrator;
}();
/**
 * Optimal sequence kernel association test (SKAT). <p>
 *
 * The following papers detail the method:
 *
 * Original SKAT optimal test paper, utilizing genotypes instead of covariance matrices: https://doi.org/10.1016/j.ajhg.2012.06.007
 * Meta-analysis of SKAT optimal test, and use of covariance matrices: https://doi.org/10.1016/j.ajhg.2013.05.010
 *
 * @extends AggregationTest
 */


var stats_SkatOptimalTest =
/*#__PURE__*/
function (_AggregationTest4) {
  inherits_default()(SkatOptimalTest, _AggregationTest4);

  function SkatOptimalTest() {
    var _this4;

    classCallCheck_default()(this, SkatOptimalTest);

    _this4 = possibleConstructorReturn_default()(this, getPrototypeOf_default()(SkatOptimalTest).apply(this, arguments));
    _this4.label = 'SKAT Optimal';
    _this4.key = 'skat-o';
    _this4.requiresMaf = true;
    /**
     * Skat test method. Only used for dev/testing.
     * Should not be set by user.
     * @private
     * @type {string}
     */

    _this4._method = 'auto';
    return _this4;
  }
  /**
   * Calculate typical SKAT weights using beta density function.
   *
   * @function
   * @param mafs {number[]} Array of minor allele frequencies.
   * @param a {number} alpha defaults to 1.
   * @param b {number} beta defaults to 25.
   */


  createClass_default()(SkatOptimalTest, [{
    key: "run",

    /**
     * Calculate optimal SKAT test. <p>
     *
     * @function
     * @param {Number[]} u Vector of score statistics (length m, number of variants).
     * @param {Number[]} v Covariance matrix of score statistics (m x m).
     * @param {Number[]} w Weight vector (length m, number of variants). If weights are not provided, they will
     *  be calculated using the default weights() method of this object.
     * @param {Number[]} mafs A vector of minor allele frequencies. These will be used to calculate weights if
     *  they were not provided.
     * @param {Number[]} rhos A vector of rho values, representing the weighting between burden and SKAT statistics.
     * @return {Number[]} SKAT p-value.
     */
    value: function run(u, v, w, mafs, rhos) {
      var dot = numeric_1_2_6_default.a.dot,
          sum = numeric_1_2_6_default.a.sum,
          mul = numeric_1_2_6_default.a.mul,
          div = numeric_1_2_6_default.a.div,
          sub = numeric_1_2_6_default.a.sub,
          rep = numeric_1_2_6_default.a.rep,
          pow = numeric_1_2_6_default.a.pow,
          diag = numeric_1_2_6_default.a.diag;
      var t = numeric_1_2_6_default.a.transpose;

      if (u.length === 1) {
        // rvtest
        return new stats_SkatTest().run(u, v, w, mafs);
      } // Calculate weights (if necessary)


      if (w === undefined || w === null) {
        w = SkatOptimalTest.weights(mafs);
      }

      var nVar = u.length; // number of variants

      w = diag(w); // diagonal matrix

      u = t([u]); // column vector
      // Setup rho values

      if (!rhos) {
        rhos = [];

        for (var i = 0; i <= 10; i++) {
          var _v = i / 10;

          if (_v > 0.999) {
            // rvtests does this to avoid rank deficiency
            _v = 0.999;
          }

          rhos.push(_v);
        }
      }

      var nRhos = rhos.length; // MetaSKAT optimal.mod rho values
      //const rhos = [0, 0.01, 0.04, 0.09, 0.25, 0.5, 0.999];
      //const nRhos = rhos.length;
      // Calculate rho matrices (1-rho)*I + rho*1*1'
      // [ 1   rho rho ]
      // [ rho 1   rho ]
      // [ rho rho 1   ]

      var Rp = new Array(nRhos).fill(null);

      for (var _i11 = 0; _i11 < nRhos; _i11++) {
        var r = rep([nVar, nVar], rhos[_i11]);

        for (var j = 0; j < r.length; j++) {
          r[j][j] = 1.0;
        }

        Rp[_i11] = r;
      } // Calculate Q statistics, where Q = U' * W * R(rho) * W * U
      // U is the score statistic vector, W is the diagonal weight matrix for each variant
      // R(rho) is a matrix for each rho value that reflects weighting between burden & SKAT


      var Qs = [];

      for (var _i12 = 0; _i12 < nRhos; _i12++) {
        Qs[_i12] = dot(t(u), dot(w, dot(Rp[_i12], dot(w, u))))[0][0];
        Qs[_i12] = Qs[_i12] / 2.0; // SKAT R package divides by 2
      } // Calculate lambdas (eigenvalues of W * IOTA * W.) In the paper, IOTA is the covariance matrix divided by
      // the phenotypic variance sigma^2.


      var lambdas = new Array(nRhos).fill(null);
      var phi = div(dot(w, dot(v, w)), 2); // https://git.io/fjwqF

      for (var _i13 = 0; _i13 < nRhos; _i13++) {
        var L = cholesky(Rp[_i13]);
        var phi_rho = dot(t(L), dot(phi, L));

        try {
          lambdas[_i13] = getEigen(phi_rho);
        } catch (error) {
          console.error(error.message);
          return [NaN, NaN];
        }
      } // Calculate moments


      var moments = new Array(nRhos).fill(null);

      for (var _i14 = 0; _i14 < nRhos; _i14++) {
        moments[_i14] = getMoment(lambdas[_i14]);
      } // Calculate p-values for each rho


      var pvals = new Array(nRhos).fill(null);

      for (var _i15 = 0; _i15 < nRhos; _i15++) {
        pvals[_i15] = getPvalByMoment(Qs[_i15], moments[_i15]);
      } // Calculate minimum p-value across all rho values


      var minP = pvals[0];
      var minIndex = 0;

      for (var _i16 = 1; _i16 < nRhos; _i16++) {
        if (pvals[_i16] < minP) {
          minP = pvals[_i16];
          minIndex = _i16;
        }
      } //const rho = rhos[minIndex];


      var Q = Qs[minIndex]; // Calculate minimum Q(p)

      var Qs_minP = new Array(nRhos).fill(null);

      for (var _i17 = 0; _i17 < nRhos; _i17++) {
        Qs_minP[_i17] = getQvalByMoment(minP, moments[_i17]);
      } // Calculate parameters needed for Z'(I-M)Z part


      var Z11 = dot(phi, rep([nVar, 1], 1));
      var ZZ = phi;
      var ZMZ = div(dot(Z11, t(Z11)), sum(ZZ));
      var ZIMZ = sub(ZZ, ZMZ);
      var lambda;

      try {
        lambda = getEigen(ZIMZ);
      } catch (error) {
        console.error(error.message);
        return [NaN, NaN];
      }

      var varZeta = 4 * sum(mul(ZMZ, ZIMZ));
      var muQ = sum(lambda);
      var varQ = 2.0 * sum(pow(lambda, 2)) + varZeta;
      var kerQ = 12.0 * sum(pow(lambda, 4)) / Math.pow(sum(pow(lambda, 2)), 2);
      var dF = 12.0 / kerQ; // Calculate taus

      var z_mean = sum(ZZ) / Math.pow(nVar, 2);
      var tau1 = sum(dot(ZZ, ZZ)) / Math.pow(nVar, 2) / z_mean;
      var taus = new Array(nRhos).fill(null);

      for (var _i18 = 0; _i18 < nRhos; _i18++) {
        taus[_i18] = nVar * nVar * rhos[_i18] * z_mean + tau1 * (1 - rhos[_i18]);
      } // Calculate final p-value


      if (new Set([rhos.length, Qs_minP.length, taus.length]).size > 1) {
        throw "Parameter arrays for SKAT integration must all be the same length";
      }

      var integrator = new stats_SkatIntegrator(rhos, lambda, Qs_minP, taus, muQ, varQ, varZeta, dF); // First pass is only capable of reaching p-values around 1e-6. To be conservative, we'll re-test if a
      // p-value reaches < 1e-4.

      integrator.setIntegrationParams(21, 30, Math.pow(Number.EPSILON, 0.25));
      var pvalue = 1 - integrator.skatOptimalIntegral();

      if (pvalue < 1e-4) {
        // Increase integration accuracy to check for more significant p-value.
        integrator.setIntegrationParams(21, 45, Math.pow(Number.EPSILON, 0.15));
        pvalue = 1 - integrator.skatOptimalIntegral();
      } // Check SKAT p-value


      var multi = nRhos < 3 ? 2 : 3;

      if (nRhos) {
        if (pvalue <= 0) {
          var p = minP * multi;

          if (pvalue < p) {
            pvalue = p;
          }
        }
      }

      if (pvalue === 0.0) {
        pvalue = pvals[0];

        for (var _i19 = 1; _i19 < nRhos; _i19++) {
          if (pvals[_i19] > 0 && pvals[_i19] < pvalue) {
            pvalue = pvals[_i19];
          }
        }
      }

      return [Q, pvalue];
    }
  }], [{
    key: "weights",
    value: function weights(mafs) {
      var a = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 25;
      var weights = Array(mafs.length).fill(null);

      for (var i = 0; i < mafs.length; i++) {
        var w = _dbeta(mafs[i], a, b, false); //w *= w;

        weights[i] = w;
      }

      return weights;
    }
  }]);

  return SkatOptimalTest;
}(stats_AggregationTest);



// CONCATENATED MODULE: ./src/app/helpers.js





/**
 * Helper methods for running aggregation tests
 *
 * This wraps internal functionality and provides utilities for reading and writing expected API formats
 */



var _all_tests = [stats_ZegginiBurdenTest, stats_SkatTest, stats_VTTest, stats_SkatOptimalTest];
/**
 * Look up aggregation tests by unique name.
 *
 * This is a helper for external libraries; it provides an immutable registry of all available tests.
 * TODO would be nice to get rid of this?
 *
 *
 * {key: {label: String, constructor: Object }
 * @type {{String: {label: String, constructor: function}}}
 */

var AGGREGATION_TESTS = Object.freeze(_all_tests.reduce(function (acc, constructor) {
  var inst = new constructor(); // Hack- need instance to access attributes

  acc[inst.key] = {
    label: inst.label,
    constructor: constructor
  };
  return acc;
}, {}));
/**
 * Helper object for reading and interpreting variant data
 */

var helpers_PortalVariantsHelper =
/*#__PURE__*/
function () {
  function PortalVariantsHelper(variants_array) {
    classCallCheck_default()(this, PortalVariantsHelper);

    this._variants = variants_array;
    this._variant_lookup = this.parsePortalVariantData(variants_array);
  }

  createClass_default()(PortalVariantsHelper, [{
    key: "parsePortalVariantData",
    value: function parsePortalVariantData(variants) {
      // Read an array of variants. Parse names into position/ref/alt, and assign altFreq to MAF.
      // Return a hash keyed on variant ID for quick lookups.
      var lookup = {};
      variants.forEach(function (data) {
        var variant = data.variant,
            altFreq = data.altFreq,
            pvalue = data.pvalue,
            score = data.score;

        var _variant$match = variant.match(REGEX_EPACTS),
            _variant$match2 = slicedToArray_default()(_variant$match, 6),
            _ = _variant$match2[0],
            chrom = _variant$match2[1],
            pos = _variant$match2[2],
            ref = _variant$match2[3],
            alt = _variant$match2[4],
            __ = _variant$match2[5]; // eslint-disable-line no-unused-vars


        var effectFreq = altFreq;
        var effect = alt;
        /**
         * The variant's score statistic in the API is coded toward the alternate allele.
         * However, we want the effect coded towards the minor allele, since most rare variant tests assume
         * you are counting the rare/minor allele.
         */

        if (altFreq > 0.5) {
          /**
           * The effect allele is initially the alt allele. Since we're flipping it,
           * the "other" allele is the reference allele.
           */
          score = -score;
          effect = ref; // This is also now the minor allele frequency.

          effectFreq = 1 - altFreq;
        }

        lookup[variant] = {
          variant: variant,
          chrom: chrom,
          pos: pos,
          pvalue: pvalue,
          score: score,
          altAllele: alt,
          effectAllele: effect,
          altFreq: altFreq,
          effectFreq: effectFreq
        };
      });
      return lookup;
    }
  }, {
    key: "isAltEffect",
    value: function isAltEffect(variant_names) {
      var _this = this;

      // Some calculations are sensitive to whether alt is the minor (effect) allele
      return variant_names.map(function (name) {
        var variant_data = _this._variant_lookup[name];
        return variant_data.altAllele === variant_data.effectAllele;
      });
    }
  }, {
    key: "getEffectFreq",
    value: function getEffectFreq(variant_names) {
      var _this2 = this;

      // Get the allele freq for the minor (effect) allele
      return variant_names.map(function (name) {
        return _this2._variant_lookup[name].effectFreq;
      });
    }
  }, {
    key: "getScores",
    value: function getScores(variant_names) {
      var _this3 = this;

      // Get single-variant scores
      return variant_names.map(function (name) {
        return _this3._variant_lookup[name].score;
      });
    }
  }, {
    key: "getGroupVariants",
    value: function getGroupVariants(variant_names) {
      var _this4 = this;

      // Return all that is known about a given set of variants
      return variant_names.map(function (name) {
        return _this4._variant_lookup[name];
      });
    }
  }, {
    key: "data",
    get: function get() {
      // Raw unparsed data
      return this._variants;
    }
  }]);

  return PortalVariantsHelper;
}(); // Utility class. Provides helper methods to access information about groups and generate subsets


var helpers_PortalGroupHelper =
/*#__PURE__*/
function () {
  function PortalGroupHelper(groups) {
    classCallCheck_default()(this, PortalGroupHelper);

    this._groups = groups;
    this._lookup = this._generateLookup(groups);
  }

  createClass_default()(PortalGroupHelper, [{
    key: "byMask",
    value: function byMask(selection) {
      // str or array
      // Get all groups that identify as a specific category of mask- "limit the analysis to loss of function variants
      // in any gene"
      if (!Array.isArray(selection)) {
        selection = [selection];
      }

      selection = new Set(selection);

      var subset = this._groups.filter(function (group) {
        return selection.has(group.mask);
      });

      return new this.constructor(subset);
    }
  }, {
    key: "byGroup",
    value: function byGroup(selection) {
      // str or array
      // Get all groups based on a specific group name, regardless of mask. Eg, "all the ways to analyze data for a
      // given gene".
      if (!Array.isArray(selection)) {
        selection = [selection];
      }

      selection = new Set(selection);

      var subset = this._groups.filter(function (group) {
        return selection.has(group.group);
      });

      return new this.constructor(subset);
    }
  }, {
    key: "_generateLookup",
    value: function _generateLookup(groups) {
      var _this5 = this;

      // We don't transform data, so this is a simple name -> position mapping
      return groups.reduce(function (acc, item, idx) {
        var key = _this5._getKey(item.mask, item.group);

        acc[key] = idx;
        return acc;
      }, {});
    }
  }, {
    key: "_getKey",
    value: function _getKey(mask_name, group_name) {
      return "".concat(mask_name, ",").concat(group_name);
    }
  }, {
    key: "getOne",
    value: function getOne(mask_name, group_name) {
      // Get a single group that is fully and uniquely identified by group + mask
      var key = this._getKey(mask_name, group_name);

      var pos = this._lookup[key];
      return this._groups[pos];
    }
  }, {
    key: "makeCovarianceMatrix",
    value: function makeCovarianceMatrix(group, is_alt_effect) {
      // Helper method that expands the portal covariance format into a full matrix.
      // Load the covariance matrix from the response JSON
      var n_variants = group.variants.length;
      var covmat = new Array(n_variants);

      for (var i = 0; i < n_variants; i++) {
        covmat[i] = new Array(n_variants).fill(null);
      }

      var c = 0;

      for (var _i = 0; _i < n_variants; _i++) {
        for (var j = _i; j < n_variants; j++) {
          var v = group.covariance[c];
          var iAlt = is_alt_effect[_i];
          var jAlt = is_alt_effect[j];
          /**
           * The API spec codes variant genotypes towards the alt allele. If the alt allele frequency
           * is > 0.5, that means we're not counting towards the minor (rare) allele, and we need to flip it around.
           * We don't flip when i == j because that element represents the variance of the variant's score, which is
           * invariant to which allele we code towards (but covariance is not.)
           *
           * We also don't flip when both the i variant and j variant need to be flipped (the ^ is XOR) because it would
           * just cancel out.
           */

          if (_i !== j) {
            if (!iAlt ^ !jAlt) {
              v = -v;
            }
          }

          covmat[_i][j] = v;
          covmat[j][_i] = v;
          c += 1;
        }
      }

      covmat = numeric_1_2_6_default.a.mul(group.nSamples, covmat);
      return covmat;
    }
  }, {
    key: "data",
    get: function get() {
      // Raw unparsed data
      return this._groups;
    }
  }]);

  return PortalGroupHelper;
}();
/**
 * Run one or more burden tests. This will operate in sequence: all specified tests on all specified masks
 *
 * The actual call signature of a burden test is pretty low-level. In addition to running the list of tests,
 *  this helper also restructures human-friendly mask and variant representations into a shape that works directly
 *  with the calculation.
 */


var helpers_PortalTestRunner =
/*#__PURE__*/
function () {
  /**
   * Create a test runner object, using group and variant data of the form provided by `parsePortalJSON`. Generally,
   *  this helper is a convenience wrapper based on the raremetal.js API format spec, and hence it expects
   *  variant and group definitions to follow that spec.
   * @param groups PortalGroupHelper
   * @param variants PortalVariantsHelper
   * @param test_names {String[]|_AggregationTest[]}
   */
  function PortalTestRunner(groups, variants) {
    var _this6 = this;

    var test_names = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    classCallCheck_default()(this, PortalTestRunner);

    this.groups = groups;
    this.variants = variants;
    this._tests = [];
    test_names.forEach(function (name) {
      return _this6.addTest(name);
    });
  }
  /**
   *
   * @param test {String|_AggregationTest}
   * @return {_AggregationTest}
   */


  createClass_default()(PortalTestRunner, [{
    key: "addTest",
    value: function addTest(test) {
      // Add a new test by name, or directly from an instance
      if (typeof test === 'string') {
        var type = AGGREGATION_TESTS[test];

        if (!type) {
          throw new Error("Cannot make unknown test type: ".concat(test));
        }

        test = new type.constructor();
      } else if (!(test instanceof stats_AggregationTest)) {
        throw new Error('Must specify test as name or instance');
      }

      this._tests.push(test);

      return test;
    }
    /**
     * Run every test on every group in the container and return results
     * @returns Promise A promise representing the fulfillment state of all tests being run
     */

  }, {
    key: "run",
    value: function run() {
      var _this7 = this;

      var partials = [];

      this._tests.forEach(function (test) {
        _this7.groups.data.forEach(function (group) {
          partials.push(_this7._runOne.bind(_this7, test, group));
        });
      }); // Despite the async syntax, ensure that each tests is run in series, to mitigate memory allocation errors when
      //  running many tests


      return partials.reduce(function (results, one_test) {
        return results.then(function (all_prior) {
          return one_test().then(function (one_res) {
            return [].concat(toConsumableArray_default()(all_prior), [one_res]);
          });
        });
      }, Promise.resolve([]));
    }
    /**
     *
     * @param {AggregationTest} test Instance for a single unit test
     * @param group {Object} Data corresponding to a specific group, following API format docs
     * @returns {{groupType: *, stat: *, test: *, pvalue: *, variants: (*|Array|string[]|Map), group: *, mask: (*|string|SVGMaskElement|string)}}
     * @private
     */

  }, {
    key: "_runOne",
    value: function _runOne(test, group) {
      // Helper method that translates portal data into the format expected by a test.
      var variants = group.variants;
      var scores = this.variants.getScores(variants); // Most calculations will require adjusting API data to ensure that minor allele is the effect allele

      var isAltEffect = this.variants.isAltEffect(variants);
      var cov = this.groups.makeCovarianceMatrix(group, isAltEffect);
      var mafs = this.variants.getEffectFreq(variants);
      var weights; // TODO: The runner never actually uses the weights argument. Should it allow this?
      // Some test classes may return a raw value and others will return a promise. Wrap the result for consistency.

      var result = test.run(scores, cov, weights, mafs);
      return Promise.resolve(result).then(function (_ref) {
        var _ref2 = slicedToArray_default()(_ref, 2),
            stat = _ref2[0],
            pvalue = _ref2[1];

        // The results describe the group + several new fields for calculation results.
        return {
          groupType: group.groupType,
          group: group.group,
          mask: group.mask,
          variants: group.variants,
          test: test.key,
          stat: stat,
          pvalue: pvalue
        };
      });
    }
    /**
     * Generate a JSON representation of the results. Returns a Promise, because some methods may run asynchronously
     *  (eg via web workers), or require loading external libraries (eg webassembly)
     * @param results Array
     * @returns {Promise<{data: {groups: Promise<any> | Array, variants: *}} | never>}
     */

  }, {
    key: "toJSON",
    value: function toJSON(results) {
      var _this8 = this;

      // Output calculation results in a format that matches the "precomputed results" endpoint
      // By passing in an argument, user can format any set of results (even combining multiple runs)
      if (!results) {
        results = this.run();
      } else {
        results = Promise.resolve(results);
      }

      return results.then(function (group_results) {
        return {
          data: {
            variants: _this8.variants.data,
            groups: group_results
          }
        };
      });
    }
  }]);

  return PortalTestRunner;
}();

function parsePortalJSON(json) {
  var data = json.data || json;
  var groups = new helpers_PortalGroupHelper(data.groups.map(function (item) {
    // Each group should have access to fields that, in portal json, are defined once globally
    item.nSamples = data.nSamples;
    item.sigmaSquared = data.sigmaSquared;
    return item;
  }));
  var variants = new helpers_PortalVariantsHelper(data.variants);
  return [groups, variants];
}

 // testing only


// CONCATENATED MODULE: ./src/app/browser.js
/* concated harmony reexport helpers */__webpack_require__.d(__webpack_exports__, "helpers", function() { return helpers_namespaceObject; });
/* concated harmony reexport stats */__webpack_require__.d(__webpack_exports__, "stats", function() { return stats_namespaceObject; });
/**
 * Calculate aggregation tests and meta-analysis of these tests
 * using score statistics and covariance matrices in the browser.
 *
 * This is the user-facing bundle, which exposes an API suitable for use in the web browser.
 * If using es6 modules exclusively, consider including those files directly for greater control.
 *
 * @module browser
 * @license MIT
 */




/***/ })
/******/ ]);
});
//# sourceMappingURL=raremetal.js.map