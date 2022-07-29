import { isAddress, getAddress as getAddress$1 } from '@ethersproject/address';
import { hexlify, arrayify, stripZeros, isBytesLike, splitSignature, hexZeroPad } from '@ethersproject/bytes';
import { bech32 } from 'bech32';
import '@ethersproject/wallet';
import { checkProperties, shallowCopy, getStatic } from '@ethersproject/properties';
import { keccak256 } from '@ethersproject/keccak256';
import { parseUnits, formatUnits, parseEther } from '@ethersproject/units';
import { Logger } from '@ethersproject/logger';
import { BigNumber } from '@ethersproject/bignumber';
import { recoverAddress } from '@ethersproject/transactions';
import { encode, decode } from '@ethersproject/rlp';
import { One, Two, Zero } from '@ethersproject/constants';
import { Formatter, JsonRpcProvider } from '@ethersproject/providers';
import { randomBytes } from 'crypto';
import { poll } from '@ethersproject/web';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

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

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime_1 = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined$1; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined$1) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined$1;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined$1;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined$1;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined$1, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined$1;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined$1;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined$1;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   module.exports 
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}
});

var HRP = "one";
var tHRP = "tone";
var isBech32Address = function isBech32Address(raw) {
  return !!raw.match(/^one1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{38}/);
};
var isBech32TestNetAddress = function isBech32TestNetAddress(raw) {
  return !!raw.match(/^tone1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{38}/);
};
var HarmonyAddress = /*#__PURE__*/function () {
  function HarmonyAddress(raw) {
    this.raw = raw;
    this.basic = this.getBasic(this.raw);
  }

  HarmonyAddress.isValidBasic = function isValidBasic(str) {
    var toTest = new HarmonyAddress(str);
    return toTest.raw === toTest.basic;
  };

  HarmonyAddress.isValidChecksum = function isValidChecksum(str) {
    var toTest = new HarmonyAddress(str);
    return toTest.raw === toTest.checksum;
  };

  HarmonyAddress.isValidBech32 = function isValidBech32(str) {
    var toTest = new HarmonyAddress(str);
    return toTest.raw === toTest.bech32;
  };

  HarmonyAddress.isValidBech32TestNet = function isValidBech32TestNet(str) {
    var toTest = new HarmonyAddress(str);
    return toTest.raw === toTest.bech32TestNet;
  };

  var _proto = HarmonyAddress.prototype;

  _proto.getBasic = function getBasic(addr) {
    if (isAddress(addr)) {
      return getAddress$1(addr).substring(2);
    }

    if (isBech32Address(addr) || isBech32TestNetAddress(addr)) {
      var _bech32$decode = bech32.decode(addr),
          prefix = _bech32$decode.prefix,
          words = _bech32$decode.words;

      if (prefix === HRP || prefix === tHRP) {
        return getAddress$1(hexlify(bech32.fromWords(words))).substring(2);
      }
    }

    throw new Error("\"" + addr + "\" is an invalid address format");
  };

  _createClass(HarmonyAddress, [{
    key: "basicHex",
    get: function get() {
      return hexlify(this.basic);
    }
  }, {
    key: "checksum",
    get: function get() {
      return getAddress$1(this.basic);
    }
  }, {
    key: "bech32",
    get: function get() {
      return bech32.encode(HRP, bech32.toWords(arrayify(this.basic)));
    }
  }, {
    key: "bech32TestNet",
    get: function get() {
      return bech32.encode(tHRP, bech32.toWords(arrayify(this.basic)));
    }
  }]);

  return HarmonyAddress;
}();
function getAddress(address) {
  try {
    return new HarmonyAddress(address);
  } catch (error) {
    throw error;
  }
}

var Directive;

(function (Directive) {
  Directive[Directive["CreateValidator"] = 0] = "CreateValidator";
  Directive[Directive["EditValidator"] = 1] = "EditValidator";
  Directive[Directive["Delegate"] = 2] = "Delegate";
  Directive[Directive["Undelegate"] = 3] = "Undelegate";
  Directive[Directive["CollectRewards"] = 4] = "CollectRewards";
})(Directive || (Directive = {}));

var logger = /*#__PURE__*/new Logger("hmy_transaction/0.0.1");
var transactionFields = [{
  name: "nonce",
  maxLength: 32,
  numeric: true
}, {
  name: "gasPrice",
  maxLength: 32,
  numeric: true
}, {
  name: "gasLimit",
  maxLength: 32,
  numeric: true
}, {
  name: "shardID",
  maxLength: 16,
  numeric: true
}, {
  name: "toShardID",
  maxLength: 16,
  numeric: true
}, {
  name: "to",
  length: 20
}, {
  name: "value",
  maxLength: 32,
  numeric: true
}, {
  name: "data"
}];
var allowedTransactionKeys = {
  nonce: true,
  gasLimit: true,
  gasPrice: true,
  shardID: true,
  toShardID: true,
  to: true,
  value: true,
  data: true,
  chainId: true
};

function formatNumber(value, name) {
  var result = stripZeros(BigNumber.from(value).toHexString());

  if (result.length > 32) {
    logger.throwArgumentError("invalid length for " + name, "transaction:" + name, value);
  }

  return result;
}

function formatDecimal(value) {
  if (typeof value === "string") {
    return [parseUnits(value, 18).toHexString()];
  }

  return [BigNumber.from(value).toHexString()];
}

function formatDescription(value) {
  var _value$name, _value$identity, _value$website, _value$securityContac, _value$details;

  return [new Uint8Array(Buffer.from((_value$name = value.name) != null ? _value$name : "")), new Uint8Array(Buffer.from((_value$identity = value.identity) != null ? _value$identity : "")), new Uint8Array(Buffer.from((_value$website = value.website) != null ? _value$website : "")), new Uint8Array(Buffer.from((_value$securityContac = value.securityContact) != null ? _value$securityContac : "")), new Uint8Array(Buffer.from((_value$details = value.details) != null ? _value$details : ""))];
}

function formatComissionRates(value) {
  return [formatDecimal(value.rate), formatDecimal(value.maxRate), formatDecimal(value.maxChangeRate)];
}

function formatMsg(type, value) {
  switch (type) {
    case Directive.CreateValidator:
      {
        var _msg$slotKeySigs;

        var msg = value;
        return [getAddress(msg.validatorAddress).checksum, formatDescription(msg.description), formatComissionRates(msg.commissionRates), formatNumber(msg.minSelfDelegation, "minSelfDelegation"), formatNumber(msg.maxTotalDelegation, "maxTotalDelegation"), msg.slotPubKeys.map(function (key) {
          return arrayify(key);
        }), (_msg$slotKeySigs = msg.slotKeySigs) == null ? void 0 : _msg$slotKeySigs.map(function (sig) {
          return arrayify(sig);
        }), formatNumber(msg.amount, "amount")];
      }

    case Directive.EditValidator:
      {
        var _msg = value;
        return [getAddress(_msg.validatorAddress).checksum, _msg.description ? formatDescription(_msg.description) : [], _msg.commissionRate ? formatDecimal(_msg.commissionRate) : "0x", _msg.minSelfDelegation ? formatNumber(_msg.minSelfDelegation, "minSelfDelegation") : "0x", _msg.maxTotalDelegation ? formatNumber(_msg.maxTotalDelegation, "maxTotalDelegation") : "0x", _msg.slotKeyToRemove ? hexlify(_msg.slotKeyToRemove) : "0x", _msg.slotKeyToAdd ? hexlify(_msg.slotKeyToAdd) : "0x", _msg.slotKeySig ? hexlify(_msg.slotKeySig) : "0x", _msg.active != null ? _msg.active ? One.toHexString() : Two.toHexString() : Zero.toHexString()];
      }

    case Directive.Delegate:
    case Directive.Undelegate:
      {
        var _msg2 = value;
        return [getAddress(_msg2.delegatorAddress).checksum, getAddress(_msg2.validatorAddress).checksum, formatNumber(_msg2.amount, "amount")];
      }

    case Directive.CollectRewards:
      {
        var _msg3 = value;
        return [getAddress(_msg3.delegatorAddress).checksum];
      }

    default:
      logger.throwArgumentError("invalid type", "type", hexlify(type));
  }
}

function serialize(transaction, signature) {
  if ("type" in transaction) {
    return serializeStakingTransaction(transaction, signature);
  }

  return serializeTransaction(transaction, signature);
}

function serializeTransaction(transaction, signature) {
  checkProperties(transaction, allowedTransactionKeys);
  var fields = [];
  transactionFields.forEach(function (fieldInfo) {
    var _transaction$fieldInf;

    var value = (_transaction$fieldInf = transaction == null ? void 0 : transaction[fieldInfo.name]) != null ? _transaction$fieldInf : [];
    var options = {};

    if (fieldInfo.numeric) {
      options.hexPad = "left";
    }

    value = arrayify(hexlify(value, options)); // Fixed-width field

    if (fieldInfo.length && value.length !== fieldInfo.length && value.length > 0) {
      logger.throwArgumentError("invalid length for " + fieldInfo.name, "transaction:" + fieldInfo.name, value);
    } // Variable-width (with a maximum)


    if (fieldInfo.maxLength) {
      value = stripZeros(value);

      if (value.length > fieldInfo.maxLength) {
        logger.throwArgumentError("invalid length for " + fieldInfo.name, "transaction:" + fieldInfo.name, value);
      }
    }

    fields.push(hexlify(value));
  });
  return encodeTransaction(transaction, fields, signature);
}

function serializeStakingTransaction(transaction, signature) {
  var fields = [transaction.type === 0 ? "0x" : BigNumber.from(transaction.type).toHexString(), formatMsg(transaction.type, transaction.msg), formatNumber(transaction.nonce || 0, "nonce"), formatNumber(transaction.gasPrice || 0, "gasPrice"), formatNumber(transaction.gasLimit || 0, "gasLimit")];
  return encodeTransaction(transaction, fields, signature);
}

function encodeTransaction(transaction, fields, signature) {
  var chainId = 1;

  if (transaction.chainId != null) {
    // A chainId was provided; if non-zero we'll use EIP-155
    chainId = transaction.chainId;

    if (typeof chainId !== "number") {
      logger.throwArgumentError("invalid transaction.chainId", "transaction", transaction);
    }
  } else if (signature && !isBytesLike(signature) && signature.v && signature.v > 28) {
    // No chainId provided, but the signature is signing with EIP-155; derive chainId
    chainId = Math.floor((signature.v - 35) / 2);
  }

  fields.push(hexlify(chainId)); // @TODO: hexValue?

  fields.push("0x");
  fields.push("0x"); // Requesting an unsigned transation

  if (!signature) {
    return encode(fields);
  }

  var sig = splitSignature(signature);
  var v = 27 + (sig.recoveryParam || 0);
  fields.pop();
  fields.pop();
  fields.pop();
  v += chainId * 2 + 8;
  fields.push(hexlify(v));
  fields.push(stripZeros(arrayify(sig.r) || []));
  fields.push(stripZeros(arrayify(sig.s) || []));
  return encode(fields);
}

function handleAddress(value) {
  if (value === "0x") {
    return '';
  }

  return getAddress(value).checksum;
}

function handleNumber(value) {
  if (value === "0x") {
    return Zero;
  }

  return BigNumber.from(value);
}

function handleDecimal(value) {
  return value;
}

function handleText(value) {
  return Buffer.from(arrayify(value)).toString();
}

function handleValidatorDescription(value) {
  return {
    name: handleText(value[0]),
    identity: handleText(value[1]),
    website: handleText(value[2]),
    securityContact: handleText(value[3]),
    details: handleText(value[4])
  };
}

function handleValidatorCommissionRates(value) {
  return {
    rate: handleDecimal(value[0]),
    maxRate: handleDecimal(value[1]),
    maxChangeRate: handleDecimal(value[2])
  };
}

function handleActive(value) {
  var status = BigNumber.from(value);

  if (status.eq(Zero)) {
    return null;
  }

  if (status.eq(One)) {
    return true;
  }

  if (status.eq(Two)) {
    return false;
  }

  return null;
}

function handleMsg(type, value) {
  switch (type) {
    case Directive.CreateValidator:
      return {
        validatorAddress: handleAddress(value[0]),
        description: handleValidatorDescription(value[1]),
        commissionRates: handleValidatorCommissionRates(value[2]),
        minSelfDelegation: handleNumber(value[3]),
        maxTotalDelegation: handleNumber(value[4]),
        slotPubKeys: value[5],
        slotKeySigs: value[6],
        amount: handleNumber(value[7])
      };

    case Directive.EditValidator:
      return {
        validatorAddress: handleAddress(value[0]),
        description: handleValidatorDescription(value[1]),
        commissionRate: handleDecimal(value[2]),
        minSelfDelegation: handleNumber(value[3]),
        maxTotalDelegation: handleNumber(value[4]),
        slotKeyToRemove: value[5],
        slotKeyToAdd: value[6],
        slotKeySig: value[7],
        active: handleActive(value[8])
      };

    case Directive.Undelegate:
    case Directive.Delegate:
      return {
        delegatorAddress: handleAddress(value[0]),
        validatorAddress: handleAddress(value[1]),
        amount: handleNumber(value[2])
      };

    case Directive.CollectRewards:
      return {
        delegatorAddress: handleAddress(value[0])
      };

    default:
      logger.throwArgumentError("invalid type", "type", hexlify(type));
      return null;
  }
}

function handleStakingTransaction(transaction) {
  if (transaction.length !== 5 && transaction.length !== 8) {
    logger.throwArgumentError("invalid component count for staking transaction", "payload", "");
  }

  var directive = transaction[0] === "0x" ? 0 : handleNumber(transaction[0]).toNumber();
  var tx = {
    type: directive,
    msg: handleMsg(directive, transaction[1]),
    nonce: handleNumber(transaction[2]).toNumber(),
    gasPrice: handleNumber(transaction[3]),
    gasLimit: handleNumber(transaction[4]),
    chainId: 1
  }; // Unsigned Transaction

  if (transaction.length === 5) {
    return tx;
  }

  try {
    tx.v = BigNumber.from(transaction[5]).toNumber();
  } catch (error) {
    return tx;
  }

  tx.r = hexZeroPad(transaction[6], 32);
  tx.s = hexZeroPad(transaction[7], 32);

  if (BigNumber.from(tx.r).isZero() && BigNumber.from(tx.s).isZero()) {
    // EIP-155 unsigned transaction
    tx.chainId = tx.v;
    tx.v = 0;
  } else {
    // Signed Tranasaction
    tx.chainId = Math.floor((tx.v - 35) / 2);
    var recoveryParam = tx.v - 27;
    var raw = transaction.slice(0, 5);
    raw.push(hexlify(tx.chainId));
    raw.push("0x");
    raw.push("0x");
    recoveryParam -= tx.chainId * 2 + 8;
    var digest = keccak256(encode(raw));

    try {
      tx.from = recoverAddress(digest, {
        r: hexlify(tx.r),
        s: hexlify(tx.s),
        recoveryParam: recoveryParam
      });
    } catch (error) {}

    tx.hash = keccak256(encode(transaction));
  }

  return tx;
}

function handleTransaction(transaction) {
  if (transaction.length !== 11 && transaction.length !== 8) {
    logger.throwArgumentError("invalid raw transaction", "transaction", "");
  }

  var tx = {
    nonce: handleNumber(transaction[0]).toNumber(),
    gasPrice: handleNumber(transaction[1]),
    gasLimit: handleNumber(transaction[2]),
    shardID: handleNumber(transaction[3]),
    toShardID: handleNumber(transaction[4]),
    to: handleAddress(transaction[5]),
    value: handleNumber(transaction[6]),
    data: transaction[7],
    chainId: 1
  }; // Legacy unsigned transaction

  if (transaction.length === 8) {
    return tx;
  }

  try {
    tx.v = BigNumber.from(transaction[8]).toNumber();
  } catch (error) {
    return tx;
  }

  tx.r = hexZeroPad(transaction[9], 32);
  tx.s = hexZeroPad(transaction[10], 32);

  if (BigNumber.from(tx.r).isZero() && BigNumber.from(tx.s).isZero()) {
    // EIP-155 unsigned transaction
    tx.chainId = tx.v;
    tx.v = 0;
  } else {
    // Signed Tranasaction
    tx.chainId = Math.floor((tx.v - 35) / 2);
    var recoveryParam = tx.v - 27;
    var raw = transaction.slice(0, 8);
    raw.push(hexlify(tx.chainId));
    raw.push("0x");
    raw.push("0x");
    recoveryParam -= tx.chainId * 2 + 8;
    var digest = keccak256(encode(raw));

    try {
      tx.from = recoverAddress(digest, {
        r: hexlify(tx.r),
        s: hexlify(tx.s),
        recoveryParam: recoveryParam
      });
    } catch (error) {}

    tx.hash = keccak256(encode(transaction));
  }

  return tx;
}

function parseTransaction(payload) {
  return handleTransaction(decode(arrayify(payload)));
}
function parseStakingTransaction(payload) {
  return handleStakingTransaction(decode(arrayify(payload)));
}
function parse(rawTransaction) {
  var payload = arrayify(rawTransaction);
  var transaction = decode(payload);

  if (Array.isArray(transaction[1])) {
    return handleStakingTransaction(transaction);
  }

  return handleTransaction(transaction);
}

var TRANSACTION_TYPES = {
  CreateValidator: 0,
  EditValidator: 1,
  Delegate: 2,
  Undelegate: 3,
  CollectRewards: 4
};

var HarmonyFormatter = /*#__PURE__*/function (_Formatter) {
  _inheritsLoose(HarmonyFormatter, _Formatter);

  function HarmonyFormatter() {
    return _Formatter.call(this) || this;
  }

  var _proto = HarmonyFormatter.prototype;

  _proto.getDefaultFormats = function getDefaultFormats() {
    var number = this.number.bind(this);
    var address = this.address.bind(this);
    var data = this.data.bind(this);
    var hash = this.hash.bind(this);
    var bigNumber = this.bigNumber.bind(this);
    var decimal = this.decimal.bind(this);
    var transactionType = this.transactionType.bind(this);

    var value = function value(v) {
      return v;
    }; // todo


    var formats = _Formatter.prototype.getDefaultFormats.call(this);

    delete formats.transaction.type;
    delete formats.transaction.accessList;
    delete formats.transactionRequest.type;
    delete formats.transactionRequest.accessList;
    formats.transaction.shardID = number;
    formats.transaction.toShardID = Formatter.allowNull(number);
    formats.receipt.type = Formatter.allowNull(transactionType);
    Object.assign(formats.block, {
      nonce: number,
      epoch: bigNumber,
      viewID: number,
      mixHash: hash,
      stakingTransactions: Formatter.allowNull(Formatter.arrayOf(hash))
    });
    formats.stakingTransaction = {
      hash: hash,
      type: transactionType,
      blockHash: Formatter.allowNull(hash, null),
      blockNumber: Formatter.allowNull(number, null),
      transactionIndex: Formatter.allowNull(number, null),
      confirmations: Formatter.allowNull(number, null),
      gasPrice: bigNumber,
      gasLimit: bigNumber,
      nonce: number,
      r: Formatter.allowNull(this.uint256.bind(this)),
      s: Formatter.allowNull(this.uint256.bind(this)),
      v: Formatter.allowNull(number),
      raw: Formatter.allowNull(data)
    };
    Object.assign(formats.blockWithTransactions, {
      nonce: number,
      epoch: bigNumber,
      viewID: number,
      mixHash: hash,
      stakingTransactions: Formatter.allowNull(Formatter.arrayOf(this.stakingTransactionResponse.bind(this)))
    });
    formats.cXReceipt = {
      blockHash: hash,
      blockNumber: number,
      to: address,
      from: address,
      shardID: number,
      toShardID: number,
      value: bigNumber
    }; // msgs formats

    formats.description = {
      name: value,
      identity: value,
      website: value,
      securityContact: value,
      details: value
    };
    formats.commissionRate = {
      rate: decimal,
      maxRate: decimal,
      maxChangeRate: decimal
    };
    formats.createValidatorMsg = {
      validatorAddress: address,
      amount: bigNumber,
      minSelfDelegation: bigNumber,
      maxTotalDelegation: bigNumber,
      slotPubKeys: Formatter.arrayOf(value)
    };
    formats.createValidatorRequestMsg = shallowCopy(formats.createValidatorMsg);
    formats.createValidatorRequestMsg.slotKeySigs = Formatter.arrayOf(value);
    formats.editValidatorMsg = {
      validatorAddress: address,
      commissionRate: Formatter.allowNull(decimal, "0x0"),
      minSelfDelegation: Formatter.allowNull(bigNumber, "0x0"),
      maxTotalDelegation: Formatter.allowNull(bigNumber, "0x0"),
      slotPubKeyToAdd: Formatter.allowNull(value, null),
      slotPubKeyToRemove: Formatter.allowNull(value, null)
    };
    formats.editValidatorRequestMsg = shallowCopy(formats.editValidatorMsg);
    formats.editValidatorRequestMsg.slotKeySigs = Formatter.allowNull(Formatter.arrayOf(value), []);
    formats.editValidatorRequestMsg.active = Formatter.allowNull(function (value) {
      return value;
    }, null);
    formats.delegateMsg = {
      delegatorAddress: address,
      validatorAddress: address,
      amount: bigNumber
    };
    formats.undelegateMsg = {
      delegatorAddress: address,
      validatorAddress: address,
      amount: bigNumber
    };
    formats.collectRewardsMsg = {
      delegatorAddress: address
    };
    formats.undelegation = {
      amount: value,
      epoch: number
    };
    formats.delegation = {
      delegatorAddress: address,
      validatorAddress: address,
      amount: value,
      reward: value,
      undelegations: Formatter.allowNull(Formatter.arrayOf(function (undelegation) {
        return Formatter.check(formats.undelegation, {
          amount: undelegation.Amount,
          epoch: undelegation.Epoch
        });
      }), [])
    };
    return formats;
  };

  _proto.decimal = function decimal(value) {
    if (value === "0x0") {
      return null;
    }

    return parseUnits(value, 18);
  };

  _proto.transaction = function transaction(value) {
    return parseTransaction(value);
  };

  _proto.stakingTransaction = function stakingTransaction(value) {
    return parseStakingTransaction(value);
  };

  _proto.transactionType = function transactionType(value) {
    var type = value;

    if (typeof value === "string") {
      type = TRANSACTION_TYPES[value];
    } // throw on invalid type ?


    return this.number(type);
  };

  _proto.msg = function msg(type, value) {
    switch (type) {
      case Directive.CreateValidator:
        {
          var msg = Formatter.check(this.formats.createValidatorMsg, value);
          msg.commissionRates = Formatter.check(this.formats.commissionRate, {
            rate: formatUnits(BigNumber.from(value.commissionRate), 18),
            maxRate: formatUnits(BigNumber.from(value.maxCommissionRate), 18),
            maxChangeRate: formatUnits(BigNumber.from(value.maxChangeRate), 18)
          });
          msg.description = Formatter.check(this.formats.description, value);
          return msg;
        }

      case Directive.EditValidator:
        {
          var _msg = Formatter.check(this.formats.editValidatorMsg, value);

          _msg.description = Formatter.check(this.formats.description, value);
          return _msg;
        }

      case Directive.Delegate:
        return Formatter.check(this.formats.delegateMsg, value);

      case Directive.Undelegate:
        return Formatter.check(this.formats.undelegateMsg, value);

      case Directive.CollectRewards:
        return Formatter.check(this.formats.collectRewardsMsg, value);

      default:
        throw new Error("Invalid msg type");
    }
  };

  _proto.address = function address(value) {
    return getAddress(value).checksum;
  };

  _proto._block = function _block(value, format) {
    return _Formatter.prototype._block.call(this, value, format);
  };

  _proto.block = function block(value) {
    return this._block(value, this.formats.block);
  };

  _proto.blockWithTransactions = function blockWithTransactions(value) {
    return this._block(value, this.formats.blockWithTransactions);
  };

  _proto.transactionResponse = function transactionResponse(transaction) {
    // Rename gas to gasLimit
    if (transaction.gas != null && transaction.gasLimit == null) {
      transaction.gasLimit = transaction.gas;
    } // Rename input to data


    if (transaction.input != null && transaction.data == null) {
      transaction.data = transaction.input;
    } // If to and creates are empty, populate the creates from the transaction


    if (transaction.to == null && transaction.creates == null) {
      transaction.creates = this.contractAddress(transaction);
    }

    var result = Formatter.check(this.formats.transaction, transaction); // 0x0000... should actually be empty STRING

    if (result.blockHash && result.blockHash.replace(/0/g, "") === "x") {
      result.blockHash = '';
    }

    return result;
  };

  _proto.stakingTransactionResponse = function stakingTransactionResponse(transaction) {
    if (transaction.gas != null && transaction.gasLimit == null) {
      transaction.gasLimit = transaction.gas;
    }

    var result = Formatter.check(this.formats.stakingTransaction, transaction);
    result.msg = this.msg(result.type, transaction.msg);
    return result;
  };

  _proto.receipt = function receipt(value) {
    if (value.type != null) {
      value.from = value.sender;
    }

    var result = Formatter.check(this.formats.receipt, value);
    return result;
  };

  _proto.cXReceipt = function cXReceipt(value) {
    return Formatter.check(this.formats.cXReceipt, value);
  };

  _proto.delegation = function delegation(value) {
    return Formatter.check(this.formats.delegation, {
      validatorAddress: value.validator_address,
      delegatorAddress: value.delegator_address,
      amount: value.amount,
      reward: value.reward,
      undelegations: value.Undelegations
    });
  };

  return HarmonyFormatter;
}(Formatter);

var logger$1 = /*#__PURE__*/new Logger("hmy_provider/0.0.1");

function timer(timeout) {
  return new Promise(function (resolve) {
    setTimeout(resolve, timeout);
  });
}

var networks = [{
  name: "mainnet",
  chainId: 1
}, {
  name: "testnet",
  chainId: 2
}, {
  name: "localnet",
  chainId: 3
}];
var ApiHarmonyProvider = /*#__PURE__*/function (_JsonRpcProvider) {
  _inheritsLoose(ApiHarmonyProvider, _JsonRpcProvider);

  function ApiHarmonyProvider(url) {
    var _this;

    _this = _JsonRpcProvider.call(this, url) || this;
    _this._nextId = randomBytes(1).readUInt8();
    return _this;
  }

  ApiHarmonyProvider.getNetwork = function getNetwork(network, shardingStructure) {
    if (typeof network === "number") {
      var _shardingStructure$fi, _shardingStructure$fi2, _networks$find;

      var shardID = (_shardingStructure$fi = shardingStructure == null ? void 0 : (_shardingStructure$fi2 = shardingStructure.find(function (shard) {
        return shard.current;
      })) == null ? void 0 : _shardingStructure$fi2.shardID) != null ? _shardingStructure$fi : 0;

      var _ref = (_networks$find = networks.find(function (_ref2) {
        var chainId = _ref2.chainId;
        return chainId === network;
      })) != null ? _networks$find : {
        name: "unknown"
      },
          name = _ref.name;

      return {
        shardID: shardID,
        name: name,
        chainId: network
      };
    }

    return network;
  };

  ApiHarmonyProvider.getFormatter = function getFormatter() {
    return new HarmonyFormatter();
  };

  var _proto = ApiHarmonyProvider.prototype;

  _proto.detectNetwork = /*#__PURE__*/function () {
    var _detectNetwork = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee() {
      var chainId, shardingStructure, getNetwork;
      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return timer(0);

            case 2:
              chainId = null;
              _context.prev = 3;
              _context.next = 6;
              return this.send("hmy_chainId", []);

            case 6:
              chainId = _context.sent;
              _context.next = 19;
              break;

            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](3);
              _context.prev = 11;
              _context.next = 14;
              return this.send("net_version", []);

            case 14:
              chainId = _context.sent;
              _context.next = 19;
              break;

            case 17:
              _context.prev = 17;
              _context.t1 = _context["catch"](11);

            case 19:
              // this is used to dectec the current shard
              // maybe this could be inferred from network Id last digit
              shardingStructure = this._shardingStructure;

              if (shardingStructure) {
                _context.next = 29;
                break;
              }

              _context.prev = 21;
              _context.next = 24;
              return this.send("hmy_getShardingStructure", []);

            case 24:
              shardingStructure = _context.sent;
              _context.next = 29;
              break;

            case 27:
              _context.prev = 27;
              _context.t2 = _context["catch"](21);

            case 29:
              if (!(chainId != null)) {
                _context.next = 38;
                break;
              }

              getNetwork = getStatic(this.constructor, "getNetwork");
              _context.prev = 31;
              return _context.abrupt("return", getNetwork(BigNumber.from(chainId).toNumber(), shardingStructure));

            case 35:
              _context.prev = 35;
              _context.t3 = _context["catch"](31);
              return _context.abrupt("return", logger$1.throwError("could not detect network", Logger.errors.NETWORK_ERROR, {
                chainId: chainId,
                event: "invalidNetwork",
                serverError: _context.t3
              }));

            case 38:
              return _context.abrupt("return", logger$1.throwError("could not detect network", Logger.errors.NETWORK_ERROR, {
                event: "noNetwork"
              }));

            case 39:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[3, 9], [11, 17], [21, 27], [31, 35]]);
    }));

    function detectNetwork() {
      return _detectNetwork.apply(this, arguments);
    }

    return detectNetwork;
  }();

  _proto.getCirculatingSupply = /*#__PURE__*/function () {
    var _getCirculatingSupply = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2() {
      return runtime_1.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.t0 = parseEther;
              _context2.next = 3;
              return this.send("hmy_getCirculatingSupply", []);

            case 3:
              _context2.t1 = _context2.sent;
              return _context2.abrupt("return", (0, _context2.t0)(_context2.t1));

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function getCirculatingSupply() {
      return _getCirculatingSupply.apply(this, arguments);
    }

    return getCirculatingSupply;
  }();

  _proto.getTotalSupply = /*#__PURE__*/function () {
    var _getTotalSupply = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3() {
      return runtime_1.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.t0 = parseEther;
              _context3.next = 3;
              return this.send("hmy_getTotalSupply", []);

            case 3:
              _context3.t1 = _context3.sent;
              return _context3.abrupt("return", (0, _context3.t0)(_context3.t1));

            case 5:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function getTotalSupply() {
      return _getTotalSupply.apply(this, arguments);
    }

    return getTotalSupply;
  }();

  _proto.getEpoch = /*#__PURE__*/function () {
    var _getEpoch = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee4() {
      return runtime_1.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.t0 = this.formatter;
              _context4.next = 3;
              return this.send("hmy_getEpoch", []);

            case 3:
              _context4.t1 = _context4.sent;
              return _context4.abrupt("return", _context4.t0.number.call(_context4.t0, _context4.t1));

            case 5:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function getEpoch() {
      return _getEpoch.apply(this, arguments);
    }

    return getEpoch;
  }();

  _proto.getEpochLastBlock = /*#__PURE__*/function () {
    var _getEpochLastBlock = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee5(epoch) {
      return runtime_1.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.t0 = this.formatter;
              _context5.next = 3;
              return this.send("hmy_epochLastBlock", [epoch]);

            case 3:
              _context5.t1 = _context5.sent;
              return _context5.abrupt("return", _context5.t0.number.call(_context5.t0, _context5.t1));

            case 5:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function getEpochLastBlock(_x) {
      return _getEpochLastBlock.apply(this, arguments);
    }

    return getEpochLastBlock;
  }();

  _proto.getLeader = /*#__PURE__*/function () {
    var _getLeader = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee6() {
      return runtime_1.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.t0 = this.formatter;
              _context6.next = 3;
              return this.send("hmy_getLeader", []);

            case 3:
              _context6.t1 = _context6.sent;
              return _context6.abrupt("return", _context6.t0.address.call(_context6.t0, _context6.t1));

            case 5:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    function getLeader() {
      return _getLeader.apply(this, arguments);
    }

    return getLeader;
  }();

  _proto.getValidatorsAddresses = /*#__PURE__*/function () {
    var _getValidatorsAddresses = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee7() {
      var _this2 = this;

      var validators;
      return runtime_1.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return this.send("hmy_getAllValidatorAddresses", []);

            case 2:
              validators = _context7.sent;
              return _context7.abrupt("return", validators.map(function (address) {
                return _this2.formatter.address(address);
              }));

            case 4:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, this);
    }));

    function getValidatorsAddresses() {
      return _getValidatorsAddresses.apply(this, arguments);
    }

    return getValidatorsAddresses;
  }();

  _proto.getActiveValidatorsAddresses = /*#__PURE__*/function () {
    var _getActiveValidatorsAddresses = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee8() {
      var _this3 = this;

      var validators;
      return runtime_1.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return this.send("hmy_getActiveValidatorAddresses", []);

            case 2:
              validators = _context8.sent;
              return _context8.abrupt("return", validators.map(function (address) {
                return _this3.formatter.address(address);
              }));

            case 4:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, this);
    }));

    function getActiveValidatorsAddresses() {
      return _getActiveValidatorsAddresses.apply(this, arguments);
    }

    return getActiveValidatorsAddresses;
  }();

  _proto.getDelegationsByValidator = /*#__PURE__*/function () {
    var _getDelegationsByValidator = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee9(validatorAddress) {
      var _this4 = this;

      var result;
      return runtime_1.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return this.send("hmy_getDelegationsByValidator", [validatorAddress]);

            case 2:
              result = _context9.sent;
              return _context9.abrupt("return", result.map(function (delegation) {
                return _this4.formatter.delegation(delegation);
              }));

            case 4:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, this);
    }));

    function getDelegationsByValidator(_x2) {
      return _getDelegationsByValidator.apply(this, arguments);
    }

    return getDelegationsByValidator;
  }();

  _proto.getDelegationsByDelegator = /*#__PURE__*/function () {
    var _getDelegationsByDelegator = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee10(delegatorAddress) {
      var _this5 = this;

      var result;
      return runtime_1.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return this.send("hmy_getDelegationsByDelegator", [delegatorAddress]);

            case 2:
              result = _context10.sent;
              return _context10.abrupt("return", result.map(function (delegation) {
                return _this5.formatter.delegation(delegation);
              }));

            case 4:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10, this);
    }));

    function getDelegationsByDelegator(_x3) {
      return _getDelegationsByDelegator.apply(this, arguments);
    }

    return getDelegationsByDelegator;
  }();

  _proto._wrapTransaction = function _wrapTransaction(tx, hash) {
    return _JsonRpcProvider.prototype._wrapTransaction.call(this, tx, hash);
  };

  _proto._wrapStakingTransaction = function _wrapStakingTransaction(tx, hash) {
    var response = tx;
    response.hash = hash || '';
    return response;
  };

  _proto.sendTransaction = /*#__PURE__*/function () {
    var _sendTransaction = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee11(signedTransaction) {
      var hexTx, tx, hash;
      return runtime_1.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return this.getNetwork();

            case 2:
              _context11.t0 = hexlify;
              _context11.next = 5;
              return Promise.resolve(signedTransaction);

            case 5:
              _context11.t1 = _context11.sent;
              hexTx = (0, _context11.t0)(_context11.t1);
              tx = this.formatter.transaction(signedTransaction);
              _context11.prev = 8;
              _context11.next = 11;
              return this.perform("sendTransaction", {
                signedTransaction: hexTx
              });

            case 11:
              hash = _context11.sent;
              return _context11.abrupt("return", this._wrapTransaction(tx, hash));

            case 15:
              _context11.prev = 15;
              _context11.t2 = _context11["catch"](8);
              _context11.t2.transaction = tx;
              _context11.t2.transactionHash = tx.hash;
              throw _context11.t2;

            case 20:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11, this, [[8, 15]]);
    }));

    function sendTransaction(_x4) {
      return _sendTransaction.apply(this, arguments);
    }

    return sendTransaction;
  }();

  _proto.sendStakingTransaction = /*#__PURE__*/function () {
    var _sendStakingTransaction = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee12(signedTransaction) {
      var hexTx, tx, hash;
      return runtime_1.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return this.getNetwork();

            case 2:
              _context12.t0 = hexlify;
              _context12.next = 5;
              return Promise.resolve(signedTransaction);

            case 5:
              _context12.t1 = _context12.sent;
              hexTx = (0, _context12.t0)(_context12.t1);
              tx = this.formatter.stakingTransaction(signedTransaction);
              _context12.prev = 8;
              _context12.next = 11;
              return this.perform("sendStackingTransaction", {
                signedTransaction: hexTx
              });

            case 11:
              hash = _context12.sent;
              return _context12.abrupt("return", this._wrapStakingTransaction(tx, hash));

            case 15:
              _context12.prev = 15;
              _context12.t2 = _context12["catch"](8);
              _context12.t2.transaction = tx;
              _context12.t2.transactionHash = tx.hash;
              throw _context12.t2;

            case 20:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12, this, [[8, 15]]);
    }));

    function sendStakingTransaction(_x5) {
      return _sendStakingTransaction.apply(this, arguments);
    }

    return sendStakingTransaction;
  }();

  _proto.prepareRequest = function prepareRequest(method, params) {
    switch (method) {
      case "sendStackingTransaction":
        return ["hmy_sendRawStakingTransaction", [params.signedTransaction]];

      case "getStakingTransaction":
        return ["hmy_getStakingTransactionByHash", [params.transactionHash]];

      case "getCXTransactionReceipt":
        return ["hmy_getCXReceiptByHash", [params.transactionHash]];

      default:
        var _JsonRpcProvider$prot = _JsonRpcProvider.prototype.prepareRequest.call(this, method, params),
            rpcMethod = _JsonRpcProvider$prot[0],
            rpcParams = _JsonRpcProvider$prot[1];

        if (rpcMethod.startsWith("eth")) {
          rpcMethod = rpcMethod.replace("eth", "hmy");
        }

        return [rpcMethod, rpcParams];
    }
  };

  _proto._getBlock = /*#__PURE__*/function () {
    var _getBlock2 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee13(blockHashOrBlockTag, includeTransactions) {
      var block, blockNumber, i, tx, confirmations;
      return runtime_1.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return _JsonRpcProvider.prototype._getBlock.call(this, blockHashOrBlockTag, includeTransactions);

            case 2:
              block = _context13.sent;
              block.shardID = this.network.shardID;

              if (!includeTransactions) {
                _context13.next = 24;
                break;
              }

              blockNumber = null;
              i = 0;

            case 7:
              if (!(i < block.stakingTransactions.length)) {
                _context13.next = 24;
                break;
              }

              tx = block.stakingTransactions[i];

              if (!(tx.blockNumber == null)) {
                _context13.next = 13;
                break;
              }

              tx.confirmations = 0;
              _context13.next = 21;
              break;

            case 13:
              if (!(tx.confirmations == null)) {
                _context13.next = 21;
                break;
              }

              if (!(blockNumber == null)) {
                _context13.next = 18;
                break;
              }

              _context13.next = 17;
              return this._getInternalBlockNumber(100 + 2 * this.pollingInterval);

            case 17:
              blockNumber = _context13.sent;

            case 18:
              // Add the confirmations using the fast block number (pessimistic)
              confirmations = blockNumber - tx.blockNumber + 1;

              if (confirmations <= 0) {
                confirmations = 1;
              }

              tx.confirmations = confirmations;

            case 21:
              i++;
              _context13.next = 7;
              break;

            case 24:
              return _context13.abrupt("return", block);

            case 25:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13, this);
    }));

    function _getBlock(_x6, _x7) {
      return _getBlock2.apply(this, arguments);
    }

    return _getBlock;
  }();

  _proto.getBlock = function getBlock(blockHashOrBlockTag) {
    return this._getBlock(blockHashOrBlockTag, false);
  };

  _proto.getBlockWithTransactions = function getBlockWithTransactions(blockHashOrBlockTag) {
    return this._getBlock(blockHashOrBlockTag, true);
  };

  _proto.getTransaction = function getTransaction(transactionHash) {
    return _JsonRpcProvider.prototype.getTransaction.call(this, transactionHash);
  };

  _proto.getStakingTransaction = /*#__PURE__*/function () {
    var _getStakingTransaction = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee15(transactionHash) {
      var _this6 = this;

      var params;
      return runtime_1.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              _context15.next = 2;
              return this.getNetwork();

            case 2:
              _context15.next = 4;
              return transactionHash;

            case 4:
              transactionHash = _context15.sent;
              params = {
                transactionHash: this.formatter.hash(transactionHash, true)
              };
              return _context15.abrupt("return", poll( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee14() {
                var result, tx, blockNumber, confirmations;
                return runtime_1.wrap(function _callee14$(_context14) {
                  while (1) {
                    switch (_context14.prev = _context14.next) {
                      case 0:
                        _context14.next = 2;
                        return _this6.perform("getStakingTransaction", params);

                      case 2:
                        result = _context14.sent;
                        tx = _this6.formatter.stakingTransactionResponse(result);

                        if (!(tx.blockNumber == null)) {
                          _context14.next = 8;
                          break;
                        }

                        tx.confirmations = 0;
                        _context14.next = 15;
                        break;

                      case 8:
                        if (!(tx.confirmations == null)) {
                          _context14.next = 15;
                          break;
                        }

                        _context14.next = 11;
                        return _this6._getInternalBlockNumber(100 + 2 * _this6.pollingInterval);

                      case 11:
                        blockNumber = _context14.sent;
                        // Add the confirmations using the fast block number (pessimistic)
                        confirmations = blockNumber - tx.blockNumber + 1;

                        if (confirmations <= 0) {
                          confirmations = 1;
                        }

                        tx.confirmations = confirmations;

                      case 15:
                        return _context14.abrupt("return", _this6._wrapStakingTransaction(tx));

                      case 16:
                      case "end":
                        return _context14.stop();
                    }
                  }
                }, _callee14);
              })), {
                oncePoll: this
              }));

            case 7:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15, this);
    }));

    function getStakingTransaction(_x8) {
      return _getStakingTransaction.apply(this, arguments);
    }

    return getStakingTransaction;
  }();

  _proto.getCXTransactionReceipt = /*#__PURE__*/function () {
    var _getCXTransactionReceipt = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee17(transactionHash) {
      var _this7 = this;

      var params;
      return runtime_1.wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              _context17.next = 2;
              return this.getNetwork();

            case 2:
              params = {
                transactionHash: this.formatter.hash(transactionHash, true)
              };
              return _context17.abrupt("return", poll( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee16() {
                var result;
                return runtime_1.wrap(function _callee16$(_context16) {
                  while (1) {
                    switch (_context16.prev = _context16.next) {
                      case 0:
                        _context16.next = 2;
                        return _this7.perform("getCXTransactionReceipt", params);

                      case 2:
                        result = _context16.sent;
                        return _context16.abrupt("return", _this7.formatter.cXReceipt(result));

                      case 4:
                      case "end":
                        return _context16.stop();
                    }
                  }
                }, _callee16);
              })), {
                oncePoll: this
              }));

            case 4:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17, this);
    }));

    function getCXTransactionReceipt(_x9) {
      return _getCXTransactionReceipt.apply(this, arguments);
    }

    return getCXTransactionReceipt;
  }();

  _createClass(ApiHarmonyProvider, [{
    key: "network",
    get: function get() {
      return this._network;
    }
  }]);

  return ApiHarmonyProvider;
}(JsonRpcProvider);

export { ApiHarmonyProvider, Directive, HRP, HarmonyAddress, getAddress, isBech32Address, isBech32TestNetAddress, parse, parseStakingTransaction, parseTransaction, serialize, serializeStakingTransaction, tHRP };
//# sourceMappingURL=harmony-ethers-sdk.esm.js.map
