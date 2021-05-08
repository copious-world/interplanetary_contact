
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.37.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCFoundation = /** @class */ (function () {
        function MDCFoundation(adapter) {
            if (adapter === void 0) { adapter = {}; }
            this.adapter = adapter;
        }
        Object.defineProperty(MDCFoundation, "cssClasses", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports every
                // CSS class the foundation class needs as a property. e.g. {ACTIVE: 'mdc-component--active'}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "strings", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports all
                // semantic strings as constants. e.g. {ARIA_ROLE: 'tablist'}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "numbers", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports all
                // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "defaultAdapter", {
            get: function () {
                // Classes extending MDCFoundation may choose to implement this getter in order to provide a convenient
                // way of viewing the necessary methods of an adapter. In the future, this could also be used for adapter
                // validation.
                return {};
            },
            enumerable: false,
            configurable: true
        });
        MDCFoundation.prototype.init = function () {
            // Subclasses should override this method to perform initialization routines (registering events, etc.)
        };
        MDCFoundation.prototype.destroy = function () {
            // Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)
        };
        return MDCFoundation;
    }());

    /**
     * @license
     * Copyright 2019 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * Determine whether the current browser supports passive event listeners, and
     * if so, use them.
     */
    function applyPassive$1(globalObj) {
        if (globalObj === void 0) { globalObj = window; }
        return supportsPassiveOption(globalObj) ?
            { passive: true } :
            false;
    }
    function supportsPassiveOption(globalObj) {
        if (globalObj === void 0) { globalObj = window; }
        // See
        // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
        var passiveSupported = false;
        try {
            var options = {
                // This function will be called when the browser
                // attempts to access the passive property.
                get passive() {
                    passiveSupported = true;
                    return false;
                }
            };
            var handler = function () { };
            globalObj.document.addEventListener('test', handler, options);
            globalObj.document.removeEventListener('test', handler, options);
        }
        catch (err) {
            passiveSupported = false;
        }
        return passiveSupported;
    }

    var events = /*#__PURE__*/Object.freeze({
        __proto__: null,
        applyPassive: applyPassive$1
    });

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * @fileoverview A "ponyfill" is a polyfill that doesn't modify the global prototype chain.
     * This makes ponyfills safer than traditional polyfills, especially for libraries like MDC.
     */
    function closest(element, selector) {
        if (element.closest) {
            return element.closest(selector);
        }
        var el = element;
        while (el) {
            if (matches$1(el, selector)) {
                return el;
            }
            el = el.parentElement;
        }
        return null;
    }
    function matches$1(element, selector) {
        var nativeMatches = element.matches
            || element.webkitMatchesSelector
            || element.msMatchesSelector;
        return nativeMatches.call(element, selector);
    }
    /**
     * Used to compute the estimated scroll width of elements. When an element is
     * hidden due to display: none; being applied to a parent element, the width is
     * returned as 0. However, the element will have a true width once no longer
     * inside a display: none context. This method computes an estimated width when
     * the element is hidden or returns the true width when the element is visble.
     * @param {Element} element the element whose width to estimate
     */
    function estimateScrollWidth(element) {
        // Check the offsetParent. If the element inherits display: none from any
        // parent, the offsetParent property will be null (see
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent).
        // This check ensures we only clone the node when necessary.
        var htmlEl = element;
        if (htmlEl.offsetParent !== null) {
            return htmlEl.scrollWidth;
        }
        var clone = htmlEl.cloneNode(true);
        clone.style.setProperty('position', 'absolute');
        clone.style.setProperty('transform', 'translate(-9999px, -9999px)');
        document.documentElement.appendChild(clone);
        var scrollWidth = clone.scrollWidth;
        document.documentElement.removeChild(clone);
        return scrollWidth;
    }

    var ponyfill = /*#__PURE__*/Object.freeze({
        __proto__: null,
        closest: closest,
        matches: matches$1,
        estimateScrollWidth: estimateScrollWidth
    });

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses$3 = {
        // Ripple is a special case where the "root" component is really a "mixin" of sorts,
        // given that it's an 'upgrade' to an existing component. That being said it is the root
        // CSS class that all other CSS classes derive from.
        BG_FOCUSED: 'mdc-ripple-upgraded--background-focused',
        FG_ACTIVATION: 'mdc-ripple-upgraded--foreground-activation',
        FG_DEACTIVATION: 'mdc-ripple-upgraded--foreground-deactivation',
        ROOT: 'mdc-ripple-upgraded',
        UNBOUNDED: 'mdc-ripple-upgraded--unbounded',
    };
    var strings$4 = {
        VAR_FG_SCALE: '--mdc-ripple-fg-scale',
        VAR_FG_SIZE: '--mdc-ripple-fg-size',
        VAR_FG_TRANSLATE_END: '--mdc-ripple-fg-translate-end',
        VAR_FG_TRANSLATE_START: '--mdc-ripple-fg-translate-start',
        VAR_LEFT: '--mdc-ripple-left',
        VAR_TOP: '--mdc-ripple-top',
    };
    var numbers$1 = {
        DEACTIVATION_TIMEOUT_MS: 225,
        FG_DEACTIVATION_MS: 150,
        INITIAL_ORIGIN_SCALE: 0.6,
        PADDING: 10,
        TAP_DELAY_MS: 300, // Delay between touch and simulated mouse events on touch devices
    };

    /**
     * Stores result from supportsCssVariables to avoid redundant processing to
     * detect CSS custom variable support.
     */
    var supportsCssVariables_;
    function supportsCssVariables(windowObj, forceRefresh) {
        if (forceRefresh === void 0) { forceRefresh = false; }
        var CSS = windowObj.CSS;
        var supportsCssVars = supportsCssVariables_;
        if (typeof supportsCssVariables_ === 'boolean' && !forceRefresh) {
            return supportsCssVariables_;
        }
        var supportsFunctionPresent = CSS && typeof CSS.supports === 'function';
        if (!supportsFunctionPresent) {
            return false;
        }
        var explicitlySupportsCssVars = CSS.supports('--css-vars', 'yes');
        // See: https://bugs.webkit.org/show_bug.cgi?id=154669
        // See: README section on Safari
        var weAreFeatureDetectingSafari10plus = (CSS.supports('(--css-vars: yes)') &&
            CSS.supports('color', '#00000000'));
        supportsCssVars =
            explicitlySupportsCssVars || weAreFeatureDetectingSafari10plus;
        if (!forceRefresh) {
            supportsCssVariables_ = supportsCssVars;
        }
        return supportsCssVars;
    }
    function getNormalizedEventCoords(evt, pageOffset, clientRect) {
        if (!evt) {
            return { x: 0, y: 0 };
        }
        var x = pageOffset.x, y = pageOffset.y;
        var documentX = x + clientRect.left;
        var documentY = y + clientRect.top;
        var normalizedX;
        var normalizedY;
        // Determine touch point relative to the ripple container.
        if (evt.type === 'touchstart') {
            var touchEvent = evt;
            normalizedX = touchEvent.changedTouches[0].pageX - documentX;
            normalizedY = touchEvent.changedTouches[0].pageY - documentY;
        }
        else {
            var mouseEvent = evt;
            normalizedX = mouseEvent.pageX - documentX;
            normalizedY = mouseEvent.pageY - documentY;
        }
        return { x: normalizedX, y: normalizedY };
    }

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    // Activation events registered on the root element of each instance for activation
    var ACTIVATION_EVENT_TYPES = [
        'touchstart', 'pointerdown', 'mousedown', 'keydown',
    ];
    // Deactivation events registered on documentElement when a pointer-related down event occurs
    var POINTER_DEACTIVATION_EVENT_TYPES = [
        'touchend', 'pointerup', 'mouseup', 'contextmenu',
    ];
    // simultaneous nested activations
    var activatedTargets = [];
    var MDCRippleFoundation = /** @class */ (function (_super) {
        __extends(MDCRippleFoundation, _super);
        function MDCRippleFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCRippleFoundation.defaultAdapter), adapter)) || this;
            _this.activationAnimationHasEnded_ = false;
            _this.activationTimer_ = 0;
            _this.fgDeactivationRemovalTimer_ = 0;
            _this.fgScale_ = '0';
            _this.frame_ = { width: 0, height: 0 };
            _this.initialSize_ = 0;
            _this.layoutFrame_ = 0;
            _this.maxRadius_ = 0;
            _this.unboundedCoords_ = { left: 0, top: 0 };
            _this.activationState_ = _this.defaultActivationState_();
            _this.activationTimerCallback_ = function () {
                _this.activationAnimationHasEnded_ = true;
                _this.runDeactivationUXLogicIfReady_();
            };
            _this.activateHandler_ = function (e) { return _this.activate_(e); };
            _this.deactivateHandler_ = function () { return _this.deactivate_(); };
            _this.focusHandler_ = function () { return _this.handleFocus(); };
            _this.blurHandler_ = function () { return _this.handleBlur(); };
            _this.resizeHandler_ = function () { return _this.layout(); };
            return _this;
        }
        Object.defineProperty(MDCRippleFoundation, "cssClasses", {
            get: function () {
                return cssClasses$3;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "strings", {
            get: function () {
                return strings$4;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "numbers", {
            get: function () {
                return numbers$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "defaultAdapter", {
            get: function () {
                return {
                    addClass: function () { return undefined; },
                    browserSupportsCssVars: function () { return true; },
                    computeBoundingRect: function () { return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 }); },
                    containsEventTarget: function () { return true; },
                    deregisterDocumentInteractionHandler: function () { return undefined; },
                    deregisterInteractionHandler: function () { return undefined; },
                    deregisterResizeHandler: function () { return undefined; },
                    getWindowPageOffset: function () { return ({ x: 0, y: 0 }); },
                    isSurfaceActive: function () { return true; },
                    isSurfaceDisabled: function () { return true; },
                    isUnbounded: function () { return true; },
                    registerDocumentInteractionHandler: function () { return undefined; },
                    registerInteractionHandler: function () { return undefined; },
                    registerResizeHandler: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    updateCssVariable: function () { return undefined; },
                };
            },
            enumerable: false,
            configurable: true
        });
        MDCRippleFoundation.prototype.init = function () {
            var _this = this;
            var supportsPressRipple = this.supportsPressRipple_();
            this.registerRootHandlers_(supportsPressRipple);
            if (supportsPressRipple) {
                var _a = MDCRippleFoundation.cssClasses, ROOT_1 = _a.ROOT, UNBOUNDED_1 = _a.UNBOUNDED;
                requestAnimationFrame(function () {
                    _this.adapter.addClass(ROOT_1);
                    if (_this.adapter.isUnbounded()) {
                        _this.adapter.addClass(UNBOUNDED_1);
                        // Unbounded ripples need layout logic applied immediately to set coordinates for both shade and ripple
                        _this.layoutInternal_();
                    }
                });
            }
        };
        MDCRippleFoundation.prototype.destroy = function () {
            var _this = this;
            if (this.supportsPressRipple_()) {
                if (this.activationTimer_) {
                    clearTimeout(this.activationTimer_);
                    this.activationTimer_ = 0;
                    this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_ACTIVATION);
                }
                if (this.fgDeactivationRemovalTimer_) {
                    clearTimeout(this.fgDeactivationRemovalTimer_);
                    this.fgDeactivationRemovalTimer_ = 0;
                    this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_DEACTIVATION);
                }
                var _a = MDCRippleFoundation.cssClasses, ROOT_2 = _a.ROOT, UNBOUNDED_2 = _a.UNBOUNDED;
                requestAnimationFrame(function () {
                    _this.adapter.removeClass(ROOT_2);
                    _this.adapter.removeClass(UNBOUNDED_2);
                    _this.removeCssVars_();
                });
            }
            this.deregisterRootHandlers_();
            this.deregisterDeactivationHandlers_();
        };
        /**
         * @param evt Optional event containing position information.
         */
        MDCRippleFoundation.prototype.activate = function (evt) {
            this.activate_(evt);
        };
        MDCRippleFoundation.prototype.deactivate = function () {
            this.deactivate_();
        };
        MDCRippleFoundation.prototype.layout = function () {
            var _this = this;
            if (this.layoutFrame_) {
                cancelAnimationFrame(this.layoutFrame_);
            }
            this.layoutFrame_ = requestAnimationFrame(function () {
                _this.layoutInternal_();
                _this.layoutFrame_ = 0;
            });
        };
        MDCRippleFoundation.prototype.setUnbounded = function (unbounded) {
            var UNBOUNDED = MDCRippleFoundation.cssClasses.UNBOUNDED;
            if (unbounded) {
                this.adapter.addClass(UNBOUNDED);
            }
            else {
                this.adapter.removeClass(UNBOUNDED);
            }
        };
        MDCRippleFoundation.prototype.handleFocus = function () {
            var _this = this;
            requestAnimationFrame(function () { return _this.adapter.addClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
        };
        MDCRippleFoundation.prototype.handleBlur = function () {
            var _this = this;
            requestAnimationFrame(function () { return _this.adapter.removeClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
        };
        /**
         * We compute this property so that we are not querying information about the client
         * until the point in time where the foundation requests it. This prevents scenarios where
         * client-side feature-detection may happen too early, such as when components are rendered on the server
         * and then initialized at mount time on the client.
         */
        MDCRippleFoundation.prototype.supportsPressRipple_ = function () {
            return this.adapter.browserSupportsCssVars();
        };
        MDCRippleFoundation.prototype.defaultActivationState_ = function () {
            return {
                activationEvent: undefined,
                hasDeactivationUXRun: false,
                isActivated: false,
                isProgrammatic: false,
                wasActivatedByPointer: false,
                wasElementMadeActive: false,
            };
        };
        /**
         * supportsPressRipple Passed from init to save a redundant function call
         */
        MDCRippleFoundation.prototype.registerRootHandlers_ = function (supportsPressRipple) {
            var _this = this;
            if (supportsPressRipple) {
                ACTIVATION_EVENT_TYPES.forEach(function (evtType) {
                    _this.adapter.registerInteractionHandler(evtType, _this.activateHandler_);
                });
                if (this.adapter.isUnbounded()) {
                    this.adapter.registerResizeHandler(this.resizeHandler_);
                }
            }
            this.adapter.registerInteractionHandler('focus', this.focusHandler_);
            this.adapter.registerInteractionHandler('blur', this.blurHandler_);
        };
        MDCRippleFoundation.prototype.registerDeactivationHandlers_ = function (evt) {
            var _this = this;
            if (evt.type === 'keydown') {
                this.adapter.registerInteractionHandler('keyup', this.deactivateHandler_);
            }
            else {
                POINTER_DEACTIVATION_EVENT_TYPES.forEach(function (evtType) {
                    _this.adapter.registerDocumentInteractionHandler(evtType, _this.deactivateHandler_);
                });
            }
        };
        MDCRippleFoundation.prototype.deregisterRootHandlers_ = function () {
            var _this = this;
            ACTIVATION_EVENT_TYPES.forEach(function (evtType) {
                _this.adapter.deregisterInteractionHandler(evtType, _this.activateHandler_);
            });
            this.adapter.deregisterInteractionHandler('focus', this.focusHandler_);
            this.adapter.deregisterInteractionHandler('blur', this.blurHandler_);
            if (this.adapter.isUnbounded()) {
                this.adapter.deregisterResizeHandler(this.resizeHandler_);
            }
        };
        MDCRippleFoundation.prototype.deregisterDeactivationHandlers_ = function () {
            var _this = this;
            this.adapter.deregisterInteractionHandler('keyup', this.deactivateHandler_);
            POINTER_DEACTIVATION_EVENT_TYPES.forEach(function (evtType) {
                _this.adapter.deregisterDocumentInteractionHandler(evtType, _this.deactivateHandler_);
            });
        };
        MDCRippleFoundation.prototype.removeCssVars_ = function () {
            var _this = this;
            var rippleStrings = MDCRippleFoundation.strings;
            var keys = Object.keys(rippleStrings);
            keys.forEach(function (key) {
                if (key.indexOf('VAR_') === 0) {
                    _this.adapter.updateCssVariable(rippleStrings[key], null);
                }
            });
        };
        MDCRippleFoundation.prototype.activate_ = function (evt) {
            var _this = this;
            if (this.adapter.isSurfaceDisabled()) {
                return;
            }
            var activationState = this.activationState_;
            if (activationState.isActivated) {
                return;
            }
            // Avoid reacting to follow-on events fired by touch device after an already-processed user interaction
            var previousActivationEvent = this.previousActivationEvent_;
            var isSameInteraction = previousActivationEvent && evt !== undefined && previousActivationEvent.type !== evt.type;
            if (isSameInteraction) {
                return;
            }
            activationState.isActivated = true;
            activationState.isProgrammatic = evt === undefined;
            activationState.activationEvent = evt;
            activationState.wasActivatedByPointer = activationState.isProgrammatic ? false : evt !== undefined && (evt.type === 'mousedown' || evt.type === 'touchstart' || evt.type === 'pointerdown');
            var hasActivatedChild = evt !== undefined &&
                activatedTargets.length > 0 &&
                activatedTargets.some(function (target) { return _this.adapter.containsEventTarget(target); });
            if (hasActivatedChild) {
                // Immediately reset activation state, while preserving logic that prevents touch follow-on events
                this.resetActivationState_();
                return;
            }
            if (evt !== undefined) {
                activatedTargets.push(evt.target);
                this.registerDeactivationHandlers_(evt);
            }
            activationState.wasElementMadeActive = this.checkElementMadeActive_(evt);
            if (activationState.wasElementMadeActive) {
                this.animateActivation_();
            }
            requestAnimationFrame(function () {
                // Reset array on next frame after the current event has had a chance to bubble to prevent ancestor ripples
                activatedTargets = [];
                if (!activationState.wasElementMadeActive
                    && evt !== undefined
                    && (evt.key === ' ' || evt.keyCode === 32)) {
                    // If space was pressed, try again within an rAF call to detect :active, because different UAs report
                    // active states inconsistently when they're called within event handling code:
                    // - https://bugs.chromium.org/p/chromium/issues/detail?id=635971
                    // - https://bugzilla.mozilla.org/show_bug.cgi?id=1293741
                    // We try first outside rAF to support Edge, which does not exhibit this problem, but will crash if a CSS
                    // variable is set within a rAF callback for a submit button interaction (#2241).
                    activationState.wasElementMadeActive = _this.checkElementMadeActive_(evt);
                    if (activationState.wasElementMadeActive) {
                        _this.animateActivation_();
                    }
                }
                if (!activationState.wasElementMadeActive) {
                    // Reset activation state immediately if element was not made active.
                    _this.activationState_ = _this.defaultActivationState_();
                }
            });
        };
        MDCRippleFoundation.prototype.checkElementMadeActive_ = function (evt) {
            return (evt !== undefined && evt.type === 'keydown') ?
                this.adapter.isSurfaceActive() :
                true;
        };
        MDCRippleFoundation.prototype.animateActivation_ = function () {
            var _this = this;
            var _a = MDCRippleFoundation.strings, VAR_FG_TRANSLATE_START = _a.VAR_FG_TRANSLATE_START, VAR_FG_TRANSLATE_END = _a.VAR_FG_TRANSLATE_END;
            var _b = MDCRippleFoundation.cssClasses, FG_DEACTIVATION = _b.FG_DEACTIVATION, FG_ACTIVATION = _b.FG_ACTIVATION;
            var DEACTIVATION_TIMEOUT_MS = MDCRippleFoundation.numbers.DEACTIVATION_TIMEOUT_MS;
            this.layoutInternal_();
            var translateStart = '';
            var translateEnd = '';
            if (!this.adapter.isUnbounded()) {
                var _c = this.getFgTranslationCoordinates_(), startPoint = _c.startPoint, endPoint = _c.endPoint;
                translateStart = startPoint.x + "px, " + startPoint.y + "px";
                translateEnd = endPoint.x + "px, " + endPoint.y + "px";
            }
            this.adapter.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);
            this.adapter.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd);
            // Cancel any ongoing activation/deactivation animations
            clearTimeout(this.activationTimer_);
            clearTimeout(this.fgDeactivationRemovalTimer_);
            this.rmBoundedActivationClasses_();
            this.adapter.removeClass(FG_DEACTIVATION);
            // Force layout in order to re-trigger the animation.
            this.adapter.computeBoundingRect();
            this.adapter.addClass(FG_ACTIVATION);
            this.activationTimer_ = setTimeout(function () { return _this.activationTimerCallback_(); }, DEACTIVATION_TIMEOUT_MS);
        };
        MDCRippleFoundation.prototype.getFgTranslationCoordinates_ = function () {
            var _a = this.activationState_, activationEvent = _a.activationEvent, wasActivatedByPointer = _a.wasActivatedByPointer;
            var startPoint;
            if (wasActivatedByPointer) {
                startPoint = getNormalizedEventCoords(activationEvent, this.adapter.getWindowPageOffset(), this.adapter.computeBoundingRect());
            }
            else {
                startPoint = {
                    x: this.frame_.width / 2,
                    y: this.frame_.height / 2,
                };
            }
            // Center the element around the start point.
            startPoint = {
                x: startPoint.x - (this.initialSize_ / 2),
                y: startPoint.y - (this.initialSize_ / 2),
            };
            var endPoint = {
                x: (this.frame_.width / 2) - (this.initialSize_ / 2),
                y: (this.frame_.height / 2) - (this.initialSize_ / 2),
            };
            return { startPoint: startPoint, endPoint: endPoint };
        };
        MDCRippleFoundation.prototype.runDeactivationUXLogicIfReady_ = function () {
            var _this = this;
            // This method is called both when a pointing device is released, and when the activation animation ends.
            // The deactivation animation should only run after both of those occur.
            var FG_DEACTIVATION = MDCRippleFoundation.cssClasses.FG_DEACTIVATION;
            var _a = this.activationState_, hasDeactivationUXRun = _a.hasDeactivationUXRun, isActivated = _a.isActivated;
            var activationHasEnded = hasDeactivationUXRun || !isActivated;
            if (activationHasEnded && this.activationAnimationHasEnded_) {
                this.rmBoundedActivationClasses_();
                this.adapter.addClass(FG_DEACTIVATION);
                this.fgDeactivationRemovalTimer_ = setTimeout(function () {
                    _this.adapter.removeClass(FG_DEACTIVATION);
                }, numbers$1.FG_DEACTIVATION_MS);
            }
        };
        MDCRippleFoundation.prototype.rmBoundedActivationClasses_ = function () {
            var FG_ACTIVATION = MDCRippleFoundation.cssClasses.FG_ACTIVATION;
            this.adapter.removeClass(FG_ACTIVATION);
            this.activationAnimationHasEnded_ = false;
            this.adapter.computeBoundingRect();
        };
        MDCRippleFoundation.prototype.resetActivationState_ = function () {
            var _this = this;
            this.previousActivationEvent_ = this.activationState_.activationEvent;
            this.activationState_ = this.defaultActivationState_();
            // Touch devices may fire additional events for the same interaction within a short time.
            // Store the previous event until it's safe to assume that subsequent events are for new interactions.
            setTimeout(function () { return _this.previousActivationEvent_ = undefined; }, MDCRippleFoundation.numbers.TAP_DELAY_MS);
        };
        MDCRippleFoundation.prototype.deactivate_ = function () {
            var _this = this;
            var activationState = this.activationState_;
            // This can happen in scenarios such as when you have a keyup event that blurs the element.
            if (!activationState.isActivated) {
                return;
            }
            var state = __assign({}, activationState);
            if (activationState.isProgrammatic) {
                requestAnimationFrame(function () { return _this.animateDeactivation_(state); });
                this.resetActivationState_();
            }
            else {
                this.deregisterDeactivationHandlers_();
                requestAnimationFrame(function () {
                    _this.activationState_.hasDeactivationUXRun = true;
                    _this.animateDeactivation_(state);
                    _this.resetActivationState_();
                });
            }
        };
        MDCRippleFoundation.prototype.animateDeactivation_ = function (_a) {
            var wasActivatedByPointer = _a.wasActivatedByPointer, wasElementMadeActive = _a.wasElementMadeActive;
            if (wasActivatedByPointer || wasElementMadeActive) {
                this.runDeactivationUXLogicIfReady_();
            }
        };
        MDCRippleFoundation.prototype.layoutInternal_ = function () {
            var _this = this;
            this.frame_ = this.adapter.computeBoundingRect();
            var maxDim = Math.max(this.frame_.height, this.frame_.width);
            // Surface diameter is treated differently for unbounded vs. bounded ripples.
            // Unbounded ripple diameter is calculated smaller since the surface is expected to already be padded appropriately
            // to extend the hitbox, and the ripple is expected to meet the edges of the padded hitbox (which is typically
            // square). Bounded ripples, on the other hand, are fully expected to expand beyond the surface's longest diameter
            // (calculated based on the diagonal plus a constant padding), and are clipped at the surface's border via
            // `overflow: hidden`.
            var getBoundedRadius = function () {
                var hypotenuse = Math.sqrt(Math.pow(_this.frame_.width, 2) + Math.pow(_this.frame_.height, 2));
                return hypotenuse + MDCRippleFoundation.numbers.PADDING;
            };
            this.maxRadius_ = this.adapter.isUnbounded() ? maxDim : getBoundedRadius();
            // Ripple is sized as a fraction of the largest dimension of the surface, then scales up using a CSS scale transform
            var initialSize = Math.floor(maxDim * MDCRippleFoundation.numbers.INITIAL_ORIGIN_SCALE);
            // Unbounded ripple size should always be even number to equally center align.
            if (this.adapter.isUnbounded() && initialSize % 2 !== 0) {
                this.initialSize_ = initialSize - 1;
            }
            else {
                this.initialSize_ = initialSize;
            }
            this.fgScale_ = "" + this.maxRadius_ / this.initialSize_;
            this.updateLayoutCssVars_();
        };
        MDCRippleFoundation.prototype.updateLayoutCssVars_ = function () {
            var _a = MDCRippleFoundation.strings, VAR_FG_SIZE = _a.VAR_FG_SIZE, VAR_LEFT = _a.VAR_LEFT, VAR_TOP = _a.VAR_TOP, VAR_FG_SCALE = _a.VAR_FG_SCALE;
            this.adapter.updateCssVariable(VAR_FG_SIZE, this.initialSize_ + "px");
            this.adapter.updateCssVariable(VAR_FG_SCALE, this.fgScale_);
            if (this.adapter.isUnbounded()) {
                this.unboundedCoords_ = {
                    left: Math.round((this.frame_.width / 2) - (this.initialSize_ / 2)),
                    top: Math.round((this.frame_.height / 2) - (this.initialSize_ / 2)),
                };
                this.adapter.updateCssVariable(VAR_LEFT, this.unboundedCoords_.left + "px");
                this.adapter.updateCssVariable(VAR_TOP, this.unboundedCoords_.top + "px");
            }
        };
        return MDCRippleFoundation;
    }(MDCFoundation));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses$2 = {
        ACTIVE: 'mdc-tab-indicator--active',
        FADE: 'mdc-tab-indicator--fade',
        NO_TRANSITION: 'mdc-tab-indicator--no-transition',
    };
    var strings$3 = {
        CONTENT_SELECTOR: '.mdc-tab-indicator__content',
    };

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCTabIndicatorFoundation = /** @class */ (function (_super) {
        __extends(MDCTabIndicatorFoundation, _super);
        function MDCTabIndicatorFoundation(adapter) {
            return _super.call(this, __assign(__assign({}, MDCTabIndicatorFoundation.defaultAdapter), adapter)) || this;
        }
        Object.defineProperty(MDCTabIndicatorFoundation, "cssClasses", {
            get: function () {
                return cssClasses$2;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTabIndicatorFoundation, "strings", {
            get: function () {
                return strings$3;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTabIndicatorFoundation, "defaultAdapter", {
            get: function () {
                // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
                return {
                    addClass: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    computeContentClientRect: function () { return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 }); },
                    setContentStyleProperty: function () { return undefined; },
                };
                // tslint:enable:object-literal-sort-keys
            },
            enumerable: false,
            configurable: true
        });
        MDCTabIndicatorFoundation.prototype.computeContentClientRect = function () {
            return this.adapter.computeContentClientRect();
        };
        return MDCTabIndicatorFoundation;
    }(MDCFoundation));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /* istanbul ignore next: subclass is not a branch statement */
    var MDCFadingTabIndicatorFoundation = /** @class */ (function (_super) {
        __extends(MDCFadingTabIndicatorFoundation, _super);
        function MDCFadingTabIndicatorFoundation() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MDCFadingTabIndicatorFoundation.prototype.activate = function () {
            this.adapter.addClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
        };
        MDCFadingTabIndicatorFoundation.prototype.deactivate = function () {
            this.adapter.removeClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
        };
        return MDCFadingTabIndicatorFoundation;
    }(MDCTabIndicatorFoundation));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /* istanbul ignore next: subclass is not a branch statement */
    var MDCSlidingTabIndicatorFoundation = /** @class */ (function (_super) {
        __extends(MDCSlidingTabIndicatorFoundation, _super);
        function MDCSlidingTabIndicatorFoundation() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MDCSlidingTabIndicatorFoundation.prototype.activate = function (previousIndicatorClientRect) {
            // Early exit if no indicator is present to handle cases where an indicator
            // may be activated without a prior indicator state
            if (!previousIndicatorClientRect) {
                this.adapter.addClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
                return;
            }
            // This animation uses the FLIP approach. You can read more about it at the link below:
            // https://aerotwist.com/blog/flip-your-animations/
            // Calculate the dimensions based on the dimensions of the previous indicator
            var currentClientRect = this.computeContentClientRect();
            var widthDelta = previousIndicatorClientRect.width / currentClientRect.width;
            var xPosition = previousIndicatorClientRect.left - currentClientRect.left;
            this.adapter.addClass(MDCTabIndicatorFoundation.cssClasses.NO_TRANSITION);
            this.adapter.setContentStyleProperty('transform', "translateX(" + xPosition + "px) scaleX(" + widthDelta + ")");
            // Force repaint before updating classes and transform to ensure the transform properly takes effect
            this.computeContentClientRect();
            this.adapter.removeClass(MDCTabIndicatorFoundation.cssClasses.NO_TRANSITION);
            this.adapter.addClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
            this.adapter.setContentStyleProperty('transform', '');
        };
        MDCSlidingTabIndicatorFoundation.prototype.deactivate = function () {
            this.adapter.removeClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
        };
        return MDCSlidingTabIndicatorFoundation;
    }(MDCTabIndicatorFoundation));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses$1 = {
        ACTIVE: 'mdc-tab--active',
    };
    var strings$2 = {
        ARIA_SELECTED: 'aria-selected',
        CONTENT_SELECTOR: '.mdc-tab__content',
        INTERACTED_EVENT: 'MDCTab:interacted',
        RIPPLE_SELECTOR: '.mdc-tab__ripple',
        TABINDEX: 'tabIndex',
        TAB_INDICATOR_SELECTOR: '.mdc-tab-indicator',
    };

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCTabFoundation = /** @class */ (function (_super) {
        __extends(MDCTabFoundation, _super);
        function MDCTabFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCTabFoundation.defaultAdapter), adapter)) || this;
            _this.focusOnActivate_ = true;
            return _this;
        }
        Object.defineProperty(MDCTabFoundation, "cssClasses", {
            get: function () {
                return cssClasses$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTabFoundation, "strings", {
            get: function () {
                return strings$2;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTabFoundation, "defaultAdapter", {
            get: function () {
                // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
                return {
                    addClass: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    hasClass: function () { return false; },
                    setAttr: function () { return undefined; },
                    activateIndicator: function () { return undefined; },
                    deactivateIndicator: function () { return undefined; },
                    notifyInteracted: function () { return undefined; },
                    getOffsetLeft: function () { return 0; },
                    getOffsetWidth: function () { return 0; },
                    getContentOffsetLeft: function () { return 0; },
                    getContentOffsetWidth: function () { return 0; },
                    focus: function () { return undefined; },
                };
                // tslint:enable:object-literal-sort-keys
            },
            enumerable: false,
            configurable: true
        });
        MDCTabFoundation.prototype.handleClick = function () {
            // It's up to the parent component to keep track of the active Tab and
            // ensure we don't activate a Tab that's already active.
            this.adapter.notifyInteracted();
        };
        MDCTabFoundation.prototype.isActive = function () {
            return this.adapter.hasClass(cssClasses$1.ACTIVE);
        };
        /**
         * Sets whether the tab should focus itself when activated
         */
        MDCTabFoundation.prototype.setFocusOnActivate = function (focusOnActivate) {
            this.focusOnActivate_ = focusOnActivate;
        };
        /**
         * Activates the Tab
         */
        MDCTabFoundation.prototype.activate = function (previousIndicatorClientRect) {
            this.adapter.addClass(cssClasses$1.ACTIVE);
            this.adapter.setAttr(strings$2.ARIA_SELECTED, 'true');
            this.adapter.setAttr(strings$2.TABINDEX, '0');
            this.adapter.activateIndicator(previousIndicatorClientRect);
            if (this.focusOnActivate_) {
                this.adapter.focus();
            }
        };
        /**
         * Deactivates the Tab
         */
        MDCTabFoundation.prototype.deactivate = function () {
            // Early exit
            if (!this.isActive()) {
                return;
            }
            this.adapter.removeClass(cssClasses$1.ACTIVE);
            this.adapter.setAttr(strings$2.ARIA_SELECTED, 'false');
            this.adapter.setAttr(strings$2.TABINDEX, '-1');
            this.adapter.deactivateIndicator();
        };
        /**
         * Returns the dimensions of the Tab
         */
        MDCTabFoundation.prototype.computeDimensions = function () {
            var rootWidth = this.adapter.getOffsetWidth();
            var rootLeft = this.adapter.getOffsetLeft();
            var contentWidth = this.adapter.getContentOffsetWidth();
            var contentLeft = this.adapter.getContentOffsetLeft();
            return {
                contentLeft: rootLeft + contentLeft,
                contentRight: rootLeft + contentLeft + contentWidth,
                rootLeft: rootLeft,
                rootRight: rootLeft + rootWidth,
            };
        };
        return MDCTabFoundation;
    }(MDCFoundation));

    // Match modifiers on DOM events.
    const oldModifierRegex = /^[a-z]+(?::(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
    // Match modifiers on other events.
    const newModifierRegex = /^[^$]+(?:\$(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;

    function forwardEventsBuilder(component) {
      // This is our pseudo $on function. It is defined on component mount.
      let $on;
      // This is a list of events bound before mount.
      let events = [];
      // This is the original component $on function.
      const componentOn = component.$on;

      // And we override the $on function to forward all bound events.
      component.$on = (fullEventType, ...args) => {
        let eventType = fullEventType;
        let destructor = () => {};
        if ($on) {
          // The event was bound programmatically.
          destructor = $on(eventType);
        } else {
          // The event was bound before mount by Svelte.
          events.push(eventType);
        }
        const oldModifierMatch = eventType.match(oldModifierRegex);
        const newModifierMatch = eventType.match(newModifierRegex);
        const modifierMatch = oldModifierMatch || newModifierMatch;

        if (oldModifierMatch && console) {
          console.warn(
            'Event modifiers in SMUI now use "$" instead of ":", so that all events can be bound with modifiers. Please update your event binding: ',
            eventType
          );
        }

        if (modifierMatch) {
          // Remove modifiers from the real event.
          const parts = eventType.split(oldModifierMatch ? ':' : '$');
          eventType = parts[0];
        }

        // Call the original $on function.
        const componentDestructor = componentOn.call(component, eventType, ...args);

        return (...args) => {
          destructor();
          return componentDestructor(...args);
        };
      };

      function forward(e) {
        // Internally bubble the event up from Svelte components.
        bubble(component, e);
      }

      return (node) => {
        const destructors = [];

        // This function is responsible for forwarding all bound events.
        $on = (fullEventType) => {
          let eventType = fullEventType;
          let handler = forward;
          // DOM addEventListener options argument.
          let options = false;
          const oldModifierMatch = eventType.match(oldModifierRegex);
          const newModifierMatch = eventType.match(newModifierRegex);
          const modifierMatch = oldModifierMatch || newModifierMatch;
          if (modifierMatch) {
            // Parse the event modifiers.
            // Supported modifiers:
            // - preventDefault
            // - stopPropagation
            // - passive
            // - nonpassive
            // - capture
            // - once
            const parts = eventType.split(oldModifierMatch ? ':' : '$');
            eventType = parts[0];
            options = Object.fromEntries(parts.slice(1).map((mod) => [mod, true]));
            if (options.nonpassive) {
              options.passive = false;
              delete options.nonpassive;
            }
            if (options.preventDefault) {
              handler = prevent_default(handler);
              delete options.preventDefault;
            }
            if (options.stopPropagation) {
              handler = stop_propagation(handler);
              delete options.stopPropagation;
            }
          }

          const off = listen(node, eventType, handler, options);
          const destructor = () => {
            off();
            const idx = destructors.indexOf(destructor);
            if (idx > -1) {
              destructors.splice(idx, 1);
            }
          };

          destructors.push(destructor);
          return destructor;
        };

        for (let i = 0; i < events.length; i++) {
          // Listen to all the events added before mount.
          $on(events[i]);
        }

        return {
          destroy: () => {
            // Remove all event listeners.
            for (let i = 0; i < destructors.length; i++) {
              destructors[i]();
            }
          },
        };
      };
    }

    function classMap(classObj) {
      return Object.entries(classObj)
        .filter(([name, value]) => name !== '' && value)
        .map(([name]) => name)
        .join(' ');
    }

    function dispatch(
      element,
      eventType,
      detail = {},
      eventInit = { bubbles: true }
    ) {
      if (typeof Event !== 'undefined' && element) {
        const event = new Event(eventType, eventInit);
        event.detail = detail;
        const el = 'getElement' in element ? element.getElement() : element;
        el.dispatchEvent(event);
        return event;
      }
    }

    function exclude(obj, keys) {
      let names = Object.getOwnPropertyNames(obj);
      const newObj = {};

      for (let i = 0; i < names.length; i++) {
        const name = names[i];
        const cashIndex = name.indexOf('$');
        if (
          cashIndex !== -1 &&
          keys.indexOf(name.substring(0, cashIndex + 1)) !== -1
        ) {
          continue;
        }
        if (keys.indexOf(name) !== -1) {
          continue;
        }
        newObj[name] = obj[name];
      }

      return newObj;
    }

    function prefixFilter(obj, prefix) {
      let names = Object.getOwnPropertyNames(obj);
      const newObj = {};

      for (let i = 0; i < names.length; i++) {
        const name = names[i];
        if (name.substring(0, prefix.length) === prefix) {
          newObj[name.substring(prefix.length)] = obj[name];
        }
      }

      return newObj;
    }

    function useActions(node, actions) {
      let objects = [];

      if (actions) {
        for (let i = 0; i < actions.length; i++) {
          const isArray = Array.isArray(actions[i]);
          const action = isArray ? actions[i][0] : actions[i];
          if (isArray && actions[i].length > 1) {
            objects.push(action(node, actions[i][1]));
          } else {
            objects.push(action(node));
          }
        }
      }

      return {
        update(actions) {
          if (((actions && actions.length) || 0) != objects.length) {
            throw new Error('You must not change the length of an actions array.');
          }

          if (actions) {
            for (let i = 0; i < actions.length; i++) {
              if (objects[i] && 'update' in objects[i]) {
                const isArray = Array.isArray(actions[i]);
                if (isArray && actions[i].length > 1) {
                  objects[i].update(actions[i][1]);
                } else {
                  objects[i].update();
                }
              }
            }
          }
        },

        destroy() {
          for (let i = 0; i < objects.length; i++) {
            if (objects[i] && 'destroy' in objects[i]) {
              objects[i].destroy();
            }
          }
        },
      };
    }

    const { applyPassive } = events;
    const { matches } = ponyfill;

    function Ripple(
      node,
      {
        ripple = true,
        surface = false,
        unbounded = false,
        disabled = false,
        color = null,
        active = null,
        eventTarget = null,
        activeTarget = null,
        addClass = (className) => node.classList.add(className),
        removeClass = (className) => node.classList.remove(className),
        addStyle = (name, value) => node.style.setProperty(name, value),
        initPromise = Promise.resolve(),
      } = {}
    ) {
      let instance;
      let addLayoutListener = getContext('SMUI:addLayoutListener');
      let removeLayoutListener;
      let oldActive = active;
      let oldEventTarget = eventTarget;
      let oldActiveTarget = activeTarget;

      function handleProps() {
        if (surface) {
          addClass('mdc-ripple-surface');
          if (color === 'primary') {
            addClass('smui-ripple-surface--primary');
            removeClass('smui-ripple-surface--secondary');
          } else if (color === 'secondary') {
            removeClass('smui-ripple-surface--primary');
            addClass('smui-ripple-surface--secondary');
          } else {
            removeClass('smui-ripple-surface--primary');
            removeClass('smui-ripple-surface--secondary');
          }
        }

        // Handle activation first.
        if (instance && oldActive !== active) {
          oldActive = active;
          if (active) {
            instance.activate();
          } else if (active === false) {
            instance.deactivate();
          }
        }

        // Then create/destroy an instance.
        if (ripple && !instance) {
          instance = new MDCRippleFoundation({
            addClass,
            browserSupportsCssVars: () => supportsCssVariables(window),
            computeBoundingRect: () => node.getBoundingClientRect(),
            containsEventTarget: (target) => node.contains(target),
            deregisterDocumentInteractionHandler: (evtType, handler) =>
              document.documentElement.removeEventListener(
                evtType,
                handler,
                applyPassive()
              ),
            deregisterInteractionHandler: (evtType, handler) =>
              (eventTarget || node).removeEventListener(
                evtType,
                handler,
                applyPassive()
              ),
            deregisterResizeHandler: (handler) =>
              window.removeEventListener('resize', handler),
            getWindowPageOffset: () => ({
              x: window.pageXOffset,
              y: window.pageYOffset,
            }),
            isSurfaceActive: () =>
              active == null ? matches(activeTarget || node, ':active') : active,
            isSurfaceDisabled: () => !!disabled,
            isUnbounded: () => !!unbounded,
            registerDocumentInteractionHandler: (evtType, handler) =>
              document.documentElement.addEventListener(
                evtType,
                handler,
                applyPassive()
              ),
            registerInteractionHandler: (evtType, handler) =>
              (eventTarget || node).addEventListener(
                evtType,
                handler,
                applyPassive()
              ),
            registerResizeHandler: (handler) =>
              window.addEventListener('resize', handler),
            removeClass,
            updateCssVariable: addStyle,
          });

          initPromise.then(() => {
            instance.init();
            instance.setUnbounded(unbounded);
          });
        } else if (instance && !ripple) {
          initPromise.then(() => {
            instance.destroy();
            instance = null;
          });
        }

        // Now handle event/active targets
        if (
          instance &&
          (oldEventTarget !== eventTarget || oldActiveTarget !== activeTarget)
        ) {
          oldEventTarget = eventTarget;
          oldActiveTarget = activeTarget;

          instance.destroy();
          requestAnimationFrame(() => {
            if (instance) {
              instance.init();
              instance.setUnbounded(unbounded);
            }
          });
        }

        if (!ripple && unbounded) {
          addClass('mdc-ripple-upgraded--unbounded');
        }
      }

      handleProps();

      if (addLayoutListener) {
        removeLayoutListener = addLayoutListener(layout);
      }

      function layout() {
        if (instance) {
          instance.layout();
        }
      }

      return {
        update(props) {
          ({
            ripple,
            surface,
            unbounded,
            disabled,
            color,
            active,
            eventTarget,
            activeTarget,
            addClass,
            removeClass,
            addStyle,
            initPromise,
          } = {
            ripple: true,
            surface: false,
            unbounded: false,
            disabled: false,
            color: null,
            active: null,
            eventTarget: null,
            activeTarget: null,
            addClass: (className) => node.classList.add(className),
            removeClass: (className) => node.classList.remove(className),
            addStyle: (name, value) => node.style.setProperty(name, value),
            initPromise: Promise.resolve(),
            ...props,
          });
          handleProps();
        },

        destroy() {
          if (instance) {
            instance.destroy();
            instance = null;
            removeClass('mdc-ripple-surface');
            removeClass('smui-ripple-surface--primary');
            removeClass('smui-ripple-surface--secondary');
          }

          if (removeLayoutListener) {
            removeLayoutListener();
          }
        },
      };
    }

    /* node_modules/@smui/common/A.svelte generated by Svelte v3.37.0 */
    const file$a = "node_modules/@smui/common/A.svelte";

    function create_fragment$a(ctx) {
    	let a;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);
    	let a_levels = [{ href: /*href*/ ctx[0] }, /*$$restProps*/ ctx[4]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$a, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			/*a_binding*/ ctx[8](a);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, a, /*use*/ ctx[1])),
    					action_destroyer(/*forwardEvents*/ ctx[3].call(null, a))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 64) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[6], dirty, null, null);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 2) useActions_action.update.call(null, /*use*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			/*a_binding*/ ctx[8](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	const omit_props_names = ["href","use","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("A", slots, ['default']);
    	let { href = "javascript:void(0);" } = $$props;
    	let { use = [] } = $$props;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let element = null;

    	function getElement() {
    		return element;
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			element = $$value;
    			$$invalidate(2, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("href" in $$new_props) $$invalidate(0, href = $$new_props.href);
    		if ("use" in $$new_props) $$invalidate(1, use = $$new_props.use);
    		if ("$$scope" in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		useActions,
    		href,
    		use,
    		forwardEvents,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("href" in $$props) $$invalidate(0, href = $$new_props.href);
    		if ("use" in $$props) $$invalidate(1, use = $$new_props.use);
    		if ("element" in $$props) $$invalidate(2, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		href,
    		use,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		a_binding
    	];
    }

    class A extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$a, safe_not_equal, { href: 0, use: 1, getElement: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "A",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get href() {
    		throw new Error("<A>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<A>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get use() {
    		throw new Error("<A>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<A>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[5];
    	}

    	set getElement(value) {
    		throw new Error("<A>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@smui/common/Button.svelte generated by Svelte v3.37.0 */
    const file$9 = "node_modules/@smui/common/Button.svelte";

    function create_fragment$9(ctx) {
    	let button;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let button_levels = [/*$$restProps*/ ctx[3]];
    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			set_attributes(button, button_data);
    			add_location(button, file$9, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			/*button_binding*/ ctx[7](button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, button, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[2].call(null, button))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 32) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[5], dirty, null, null);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]]));
    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			/*button_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Button", slots, ['default']);
    	let { use = [] } = $$props;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let element = null;

    	function getElement() {
    		return element;
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			element = $$value;
    			$$invalidate(1, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("use" in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ("$$scope" in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		useActions,
    		use,
    		forwardEvents,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("use" in $$props) $$invalidate(0, use = $$new_props.use);
    		if ("element" in $$props) $$invalidate(1, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		button_binding
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$9, safe_not_equal, { use: 0, getElement: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get use() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[4];
    	}

    	set getElement(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@smui/tab-indicator/TabIndicator.svelte generated by Svelte v3.37.0 */

    const file$8 = "node_modules/@smui/tab-indicator/TabIndicator.svelte";

    function create_fragment$8(ctx) {
    	let span1;
    	let span0;
    	let span0_class_value;
    	let span0_style_value;
    	let span0_aria_hidden_value;
    	let useActions_action;
    	let span1_class_value;
    	let useActions_action_1;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[21].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[20], null);

    	let span0_levels = [
    		{
    			class: span0_class_value = classMap({
    				[/*content$class*/ ctx[6]]: true,
    				"mdc-tab-indicator__content": true,
    				"mdc-tab-indicator__content--underline": /*type*/ ctx[3] === "underline",
    				"mdc-tab-indicator__content--icon": /*type*/ ctx[3] === "icon"
    			})
    		},
    		{
    			style: span0_style_value = Object.entries(/*contentStyles*/ ctx[10]).map(func$2).join(" ")
    		},
    		{
    			"aria-hidden": span0_aria_hidden_value = /*type*/ ctx[3] === "icon" ? "true" : null
    		},
    		prefixFilter(/*$$restProps*/ ctx[12], "content$")
    	];

    	let span0_data = {};

    	for (let i = 0; i < span0_levels.length; i += 1) {
    		span0_data = assign(span0_data, span0_levels[i]);
    	}

    	let span1_levels = [
    		{
    			class: span1_class_value = classMap({
    				[/*className*/ ctx[2]]: true,
    				"mdc-tab-indicator": true,
    				"mdc-tab-indicator--active": /*active*/ ctx[0],
    				"mdc-tab-indicator--fade": /*transition*/ ctx[4] === "fade",
    				.../*internalClasses*/ ctx[9]
    			})
    		},
    		exclude(/*$$restProps*/ ctx[12], ["content$"])
    	];

    	let span1_data = {};

    	for (let i = 0; i < span1_levels.length; i += 1) {
    		span1_data = assign(span1_data, span1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			span1 = element("span");
    			span0 = element("span");
    			if (default_slot) default_slot.c();
    			set_attributes(span0, span0_data);
    			add_location(span0, file$8, 13, 2, 316);
    			set_attributes(span1, span1_data);
    			add_location(span1, file$8, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span1, anchor);
    			append_dev(span1, span0);

    			if (default_slot) {
    				default_slot.m(span0, null);
    			}

    			/*span0_binding*/ ctx[22](span0);
    			/*span1_binding*/ ctx[23](span1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, span0, /*content$use*/ ctx[5])),
    					action_destroyer(useActions_action_1 = useActions.call(null, span1, /*use*/ ctx[1])),
    					action_destroyer(/*forwardEvents*/ ctx[11].call(null, span1))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1048576) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[20], dirty, null, null);
    				}
    			}

    			set_attributes(span0, span0_data = get_spread_update(span0_levels, [
    				(!current || dirty & /*content$class, type*/ 72 && span0_class_value !== (span0_class_value = classMap({
    					[/*content$class*/ ctx[6]]: true,
    					"mdc-tab-indicator__content": true,
    					"mdc-tab-indicator__content--underline": /*type*/ ctx[3] === "underline",
    					"mdc-tab-indicator__content--icon": /*type*/ ctx[3] === "icon"
    				}))) && { class: span0_class_value },
    				(!current || dirty & /*contentStyles*/ 1024 && span0_style_value !== (span0_style_value = Object.entries(/*contentStyles*/ ctx[10]).map(func$2).join(" "))) && { style: span0_style_value },
    				(!current || dirty & /*type*/ 8 && span0_aria_hidden_value !== (span0_aria_hidden_value = /*type*/ ctx[3] === "icon" ? "true" : null)) && { "aria-hidden": span0_aria_hidden_value },
    				dirty & /*$$restProps*/ 4096 && prefixFilter(/*$$restProps*/ ctx[12], "content$")
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*content$use*/ 32) useActions_action.update.call(null, /*content$use*/ ctx[5]);

    			set_attributes(span1, span1_data = get_spread_update(span1_levels, [
    				(!current || dirty & /*className, active, transition, internalClasses*/ 533 && span1_class_value !== (span1_class_value = classMap({
    					[/*className*/ ctx[2]]: true,
    					"mdc-tab-indicator": true,
    					"mdc-tab-indicator--active": /*active*/ ctx[0],
    					"mdc-tab-indicator--fade": /*transition*/ ctx[4] === "fade",
    					.../*internalClasses*/ ctx[9]
    				}))) && { class: span1_class_value },
    				dirty & /*$$restProps*/ 4096 && exclude(/*$$restProps*/ ctx[12], ["content$"])
    			]));

    			if (useActions_action_1 && is_function(useActions_action_1.update) && dirty & /*use*/ 2) useActions_action_1.update.call(null, /*use*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span1);
    			if (default_slot) default_slot.d(detaching);
    			/*span0_binding*/ ctx[22](null);
    			/*span1_binding*/ ctx[23](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func$2 = ([name, value]) => `${name}: ${value};`;

    function instance_1$3($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","active","type","transition","content$use","content$class","activate","deactivate","computeContentClientRect","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("TabIndicator", slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = "" } = $$props;
    	let { active = false } = $$props;
    	let { type = "underline" } = $$props;
    	let { transition = "slide" } = $$props;
    	let { content$use = [] } = $$props;
    	let { content$class = "" } = $$props;
    	let element;
    	let instance;
    	let content;
    	let internalClasses = {};
    	let contentStyles = {};
    	let changeSets = [];
    	let oldTransition = transition;

    	onMount(() => {
    		$$invalidate(17, instance = getInstance());
    		instance.init();

    		return () => {
    			instance.destroy();
    		};
    	});

    	function getInstance() {
    		const Foundation = ({
    			fade: MDCFadingTabIndicatorFoundation,
    			slide: MDCSlidingTabIndicatorFoundation
    		})[transition] || MDCSlidingTabIndicatorFoundation;

    		return Foundation
    		? new Foundation({
    					addClass: (...props) => doChange(() => addClass(...props)),
    					removeClass: (...props) => doChange(() => removeClass(...props)),
    					computeContentClientRect,
    					setContentStyleProperty: (...props) => doChange(() => addContentStyle(...props))
    				})
    		: undefined;
    	}

    	function doChange(fn) {
    		if (changeSets.length) {
    			changeSets[changeSets.length - 1].push(fn);
    		} else {
    			fn();
    		}
    	}

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(9, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(9, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addContentStyle(name, value) {
    		if (contentStyles[name] != value) {
    			if (value === "" || value == null) {
    				delete contentStyles[name];
    				((($$invalidate(10, contentStyles), $$invalidate(19, oldTransition)), $$invalidate(4, transition)), $$invalidate(17, instance));
    			} else {
    				$$invalidate(10, contentStyles[name] = value, contentStyles);
    			}
    		}
    	}

    	function activate(previousIndicatorClientRect) {
    		$$invalidate(0, active = true);
    		instance.activate(previousIndicatorClientRect);
    	}

    	function deactivate() {
    		$$invalidate(0, active = false);
    		instance.deactivate();
    	}

    	function computeContentClientRect() {
    		changeSets.push([]);
    		$$invalidate(18, changeSets);
    		return content.getBoundingClientRect();
    	}

    	function getElement() {
    		return element;
    	}

    	function span0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			content = $$value;
    			$$invalidate(8, content);
    		});
    	}

    	function span1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			element = $$value;
    			$$invalidate(7, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(12, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("use" in $$new_props) $$invalidate(1, use = $$new_props.use);
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("active" in $$new_props) $$invalidate(0, active = $$new_props.active);
    		if ("type" in $$new_props) $$invalidate(3, type = $$new_props.type);
    		if ("transition" in $$new_props) $$invalidate(4, transition = $$new_props.transition);
    		if ("content$use" in $$new_props) $$invalidate(5, content$use = $$new_props.content$use);
    		if ("content$class" in $$new_props) $$invalidate(6, content$class = $$new_props.content$class);
    		if ("$$scope" in $$new_props) $$invalidate(20, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		MDCFadingTabIndicatorFoundation,
    		MDCSlidingTabIndicatorFoundation,
    		onMount,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		exclude,
    		prefixFilter,
    		useActions,
    		forwardEvents,
    		use,
    		className,
    		active,
    		type,
    		transition,
    		content$use,
    		content$class,
    		element,
    		instance,
    		content,
    		internalClasses,
    		contentStyles,
    		changeSets,
    		oldTransition,
    		getInstance,
    		doChange,
    		addClass,
    		removeClass,
    		addContentStyle,
    		activate,
    		deactivate,
    		computeContentClientRect,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("use" in $$props) $$invalidate(1, use = $$new_props.use);
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("active" in $$props) $$invalidate(0, active = $$new_props.active);
    		if ("type" in $$props) $$invalidate(3, type = $$new_props.type);
    		if ("transition" in $$props) $$invalidate(4, transition = $$new_props.transition);
    		if ("content$use" in $$props) $$invalidate(5, content$use = $$new_props.content$use);
    		if ("content$class" in $$props) $$invalidate(6, content$class = $$new_props.content$class);
    		if ("element" in $$props) $$invalidate(7, element = $$new_props.element);
    		if ("instance" in $$props) $$invalidate(17, instance = $$new_props.instance);
    		if ("content" in $$props) $$invalidate(8, content = $$new_props.content);
    		if ("internalClasses" in $$props) $$invalidate(9, internalClasses = $$new_props.internalClasses);
    		if ("contentStyles" in $$props) $$invalidate(10, contentStyles = $$new_props.contentStyles);
    		if ("changeSets" in $$props) $$invalidate(18, changeSets = $$new_props.changeSets);
    		if ("oldTransition" in $$props) $$invalidate(19, oldTransition = $$new_props.oldTransition);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*oldTransition, transition, instance*/ 655376) {
    			if (oldTransition !== transition) {
    				$$invalidate(19, oldTransition = transition);
    				instance && instance.destroy();
    				$$invalidate(9, internalClasses = {});
    				$$invalidate(10, contentStyles = {});
    				$$invalidate(17, instance = getInstance());
    				instance.init();
    			}
    		}

    		if ($$self.$$.dirty & /*changeSets*/ 262144) {
    			// Use sets of changes for DOM updates, to facilitate animations.
    			if (changeSets.length) {
    				requestAnimationFrame(() => {
    					const changeSet = changeSets.shift();
    					$$invalidate(18, changeSets);

    					for (const fn of changeSet) {
    						fn();
    					}
    				});
    			}
    		}
    	};

    	return [
    		active,
    		use,
    		className,
    		type,
    		transition,
    		content$use,
    		content$class,
    		element,
    		content,
    		internalClasses,
    		contentStyles,
    		forwardEvents,
    		$$restProps,
    		activate,
    		deactivate,
    		computeContentClientRect,
    		getElement,
    		instance,
    		changeSets,
    		oldTransition,
    		$$scope,
    		slots,
    		span0_binding,
    		span1_binding
    	];
    }

    class TabIndicator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance_1$3, create_fragment$8, safe_not_equal, {
    			use: 1,
    			class: 2,
    			active: 0,
    			type: 3,
    			transition: 4,
    			content$use: 5,
    			content$class: 6,
    			activate: 13,
    			deactivate: 14,
    			computeContentClientRect: 15,
    			getElement: 16
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabIndicator",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get use() {
    		throw new Error("<TabIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<TabIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<TabIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<TabIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error("<TabIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get content$use() {
    		throw new Error("<TabIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content$use(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get content$class() {
    		throw new Error("<TabIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content$class(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activate() {
    		return this.$$.ctx[13];
    	}

    	set activate(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get deactivate() {
    		return this.$$.ctx[14];
    	}

    	set deactivate(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get computeContentClientRect() {
    		return this.$$.ctx[15];
    	}

    	set computeContentClientRect(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[16];
    	}

    	set getElement(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@smui/tab/Tab.svelte generated by Svelte v3.37.0 */

    const { Error: Error_1 } = globals;
    const file$7 = "node_modules/@smui/tab/Tab.svelte";
    const get_tab_indicator_slot_changes_1 = dirty => ({});
    const get_tab_indicator_slot_context_1 = ctx => ({});
    const get_tab_indicator_slot_changes = dirty => ({});
    const get_tab_indicator_slot_context = ctx => ({});

    // (48:4) {#if indicatorSpanOnlyContent}
    function create_if_block_1$1(ctx) {
    	let tabindicator;
    	let current;

    	const tabindicator_spread_levels = [
    		{ active: /*active*/ ctx[18] },
    		prefixFilter(/*$$restProps*/ ctx[24], "tabIndicator$")
    	];

    	let tabindicator_props = {
    		$$slots: { default: [create_default_slot_2$1] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < tabindicator_spread_levels.length; i += 1) {
    		tabindicator_props = assign(tabindicator_props, tabindicator_spread_levels[i]);
    	}

    	tabindicator = new TabIndicator({
    			props: tabindicator_props,
    			$$inline: true
    		});

    	/*tabindicator_binding*/ ctx[31](tabindicator);

    	const block = {
    		c: function create() {
    			create_component(tabindicator.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tabindicator, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tabindicator_changes = (dirty[0] & /*active, $$restProps*/ 17039360)
    			? get_spread_update(tabindicator_spread_levels, [
    					dirty[0] & /*active*/ 262144 && { active: /*active*/ ctx[18] },
    					dirty[0] & /*$$restProps*/ 16777216 && get_spread_object(prefixFilter(/*$$restProps*/ ctx[24], "tabIndicator$"))
    				])
    			: {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				tabindicator_changes.$$scope = { dirty, ctx };
    			}

    			tabindicator.$set(tabindicator_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabindicator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabindicator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*tabindicator_binding*/ ctx[31](null);
    			destroy_component(tabindicator, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(48:4) {#if indicatorSpanOnlyContent}",
    		ctx
    	});

    	return block;
    }

    // (49:6) <TabIndicator         bind:this={tabIndicator}         {active}         {...prefixFilter($$restProps, 'tabIndicator$')}         >
    function create_default_slot_2$1(ctx) {
    	let current;
    	const tab_indicator_slot_template = /*#slots*/ ctx[30]["tab-indicator"];
    	const tab_indicator_slot = create_slot(tab_indicator_slot_template, ctx, /*$$scope*/ ctx[35], get_tab_indicator_slot_context);

    	const block = {
    		c: function create() {
    			if (tab_indicator_slot) tab_indicator_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (tab_indicator_slot) {
    				tab_indicator_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (tab_indicator_slot) {
    				if (tab_indicator_slot.p && dirty[1] & /*$$scope*/ 16) {
    					update_slot(tab_indicator_slot, tab_indicator_slot_template, ctx, /*$$scope*/ ctx[35], dirty, get_tab_indicator_slot_changes, get_tab_indicator_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab_indicator_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab_indicator_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (tab_indicator_slot) tab_indicator_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(49:6) <TabIndicator         bind:this={tabIndicator}         {active}         {...prefixFilter($$restProps, 'tabIndicator$')}         >",
    		ctx
    	});

    	return block;
    }

    // (57:2) {#if !indicatorSpanOnlyContent}
    function create_if_block$3(ctx) {
    	let tabindicator;
    	let current;

    	const tabindicator_spread_levels = [
    		{ active: /*active*/ ctx[18] },
    		prefixFilter(/*$$restProps*/ ctx[24], "tabIndicator$")
    	];

    	let tabindicator_props = {
    		$$slots: { default: [create_default_slot_1$1] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < tabindicator_spread_levels.length; i += 1) {
    		tabindicator_props = assign(tabindicator_props, tabindicator_spread_levels[i]);
    	}

    	tabindicator = new TabIndicator({
    			props: tabindicator_props,
    			$$inline: true
    		});

    	/*tabindicator_binding_1*/ ctx[33](tabindicator);

    	const block = {
    		c: function create() {
    			create_component(tabindicator.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tabindicator, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tabindicator_changes = (dirty[0] & /*active, $$restProps*/ 17039360)
    			? get_spread_update(tabindicator_spread_levels, [
    					dirty[0] & /*active*/ 262144 && { active: /*active*/ ctx[18] },
    					dirty[0] & /*$$restProps*/ 16777216 && get_spread_object(prefixFilter(/*$$restProps*/ ctx[24], "tabIndicator$"))
    				])
    			: {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				tabindicator_changes.$$scope = { dirty, ctx };
    			}

    			tabindicator.$set(tabindicator_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabindicator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabindicator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*tabindicator_binding_1*/ ctx[33](null);
    			destroy_component(tabindicator, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(57:2) {#if !indicatorSpanOnlyContent}",
    		ctx
    	});

    	return block;
    }

    // (58:4) <TabIndicator       bind:this={tabIndicator}       {active}       {...prefixFilter($$restProps, 'tabIndicator$')}       >
    function create_default_slot_1$1(ctx) {
    	let current;
    	const tab_indicator_slot_template = /*#slots*/ ctx[30]["tab-indicator"];
    	const tab_indicator_slot = create_slot(tab_indicator_slot_template, ctx, /*$$scope*/ ctx[35], get_tab_indicator_slot_context_1);

    	const block = {
    		c: function create() {
    			if (tab_indicator_slot) tab_indicator_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (tab_indicator_slot) {
    				tab_indicator_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (tab_indicator_slot) {
    				if (tab_indicator_slot.p && dirty[1] & /*$$scope*/ 16) {
    					update_slot(tab_indicator_slot, tab_indicator_slot_template, ctx, /*$$scope*/ ctx[35], dirty, get_tab_indicator_slot_changes_1, get_tab_indicator_slot_context_1);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab_indicator_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab_indicator_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (tab_indicator_slot) tab_indicator_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(58:4) <TabIndicator       bind:this={tabIndicator}       {active}       {...prefixFilter($$restProps, 'tabIndicator$')}       >",
    		ctx
    	});

    	return block;
    }

    // (1:0) <svelte:component   this={component}   bind:this={element}   use={[     [       Ripple,       {         ripple,         unbounded: false,         addClass,         removeClass,         addStyle,       },     ],     forwardEvents,     ...use,   ]}   class={classMap({     [className]: true,     'mdc-tab': true,     'mdc-tab--active': active,     'mdc-tab--stacked': stacked,     'mdc-tab--min-width': minWidth,     ...internalClasses,   })}   style={Object.entries(internalStyles)     .map(([name, value]) => `${name}: ${value};`)     .concat([style])     .join(' ')}   role="tab"   aria-selected={active ? 'true' : 'false'}   tabindex={active || forceAccessible ? '0' : '-1'}   {href}   on:click={instance && instance.handleClick()}   {...internalAttrs}   {...exclude($$restProps, ['content$', 'tabIndicator$'])} >
    function create_default_slot$2(ctx) {
    	let span0;
    	let t0;
    	let span0_class_value;
    	let useActions_action;
    	let t1;
    	let t2;
    	let span1;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[30].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[35], null);
    	let if_block0 = /*indicatorSpanOnlyContent*/ ctx[6] && create_if_block_1$1(ctx);

    	let span0_levels = [
    		{
    			class: span0_class_value = classMap({
    				[/*content$class*/ ctx[9]]: true,
    				"mdc-tab__content": true
    			})
    		},
    		prefixFilter(/*$$restProps*/ ctx[24], "content$")
    	];

    	let span0_data = {};

    	for (let i = 0; i < span0_levels.length; i += 1) {
    		span0_data = assign(span0_data, span0_levels[i]);
    	}

    	let if_block1 = !/*indicatorSpanOnlyContent*/ ctx[6] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			span0 = element("span");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			span1 = element("span");
    			set_attributes(span0, span0_data);
    			add_location(span0, file$7, 37, 2, 818);
    			attr_dev(span1, "class", "mdc-tab__ripple");
    			add_location(span1, file$7, 64, 2, 1497);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span0, anchor);

    			if (default_slot) {
    				default_slot.m(span0, null);
    			}

    			append_dev(span0, t0);
    			if (if_block0) if_block0.m(span0, null);
    			/*span0_binding*/ ctx[32](span0);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, span1, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(useActions_action = useActions.call(null, span0, /*content$use*/ ctx[8]));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty[1] & /*$$scope*/ 16) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[35], dirty, null, null);
    				}
    			}

    			if (/*indicatorSpanOnlyContent*/ ctx[6]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*indicatorSpanOnlyContent*/ 64) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(span0, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			set_attributes(span0, span0_data = get_spread_update(span0_levels, [
    				(!current || dirty[0] & /*content$class*/ 512 && span0_class_value !== (span0_class_value = classMap({
    					[/*content$class*/ ctx[9]]: true,
    					"mdc-tab__content": true
    				}))) && { class: span0_class_value },
    				dirty[0] & /*$$restProps*/ 16777216 && prefixFilter(/*$$restProps*/ ctx[24], "content$")
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty[0] & /*content$use*/ 256) useActions_action.update.call(null, /*content$use*/ ctx[8]);

    			if (!/*indicatorSpanOnlyContent*/ ctx[6]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*indicatorSpanOnlyContent*/ 64) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t2.parentNode, t2);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span0);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block0) if_block0.d();
    			/*span0_binding*/ ctx[32](null);
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(span1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(1:0) <svelte:component   this={component}   bind:this={element}   use={[     [       Ripple,       {         ripple,         unbounded: false,         addClass,         removeClass,         addStyle,       },     ],     forwardEvents,     ...use,   ]}   class={classMap({     [className]: true,     'mdc-tab': true,     'mdc-tab--active': active,     'mdc-tab--stacked': stacked,     'mdc-tab--min-width': minWidth,     ...internalClasses,   })}   style={Object.entries(internalStyles)     .map(([name, value]) => `${name}: ${value};`)     .concat([style])     .join(' ')}   role=\\\"tab\\\"   aria-selected={active ? 'true' : 'false'}   tabindex={active || forceAccessible ? '0' : '-1'}   {href}   on:click={instance && instance.handleClick()}   {...internalAttrs}   {...exclude($$restProps, ['content$', 'tabIndicator$'])} >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{
    			use: [
    				[
    					Ripple,
    					{
    						ripple: /*ripple*/ ctx[3],
    						unbounded: false,
    						addClass: /*addClass*/ ctx[21],
    						removeClass: /*removeClass*/ ctx[22],
    						addStyle: /*addStyle*/ ctx[23]
    					}
    				],
    				/*forwardEvents*/ ctx[20],
    				.../*use*/ ctx[0]
    			]
    		},
    		{
    			class: classMap({
    				[/*className*/ ctx[1]]: true,
    				"mdc-tab": true,
    				"mdc-tab--active": /*active*/ ctx[18],
    				"mdc-tab--stacked": /*stacked*/ ctx[4],
    				"mdc-tab--min-width": /*minWidth*/ ctx[5],
    				.../*internalClasses*/ ctx[15]
    			})
    		},
    		{
    			style: Object.entries(/*internalStyles*/ ctx[16]).map(func$1).concat([/*style*/ ctx[2]]).join(" ")
    		},
    		{ role: "tab" },
    		{
    			"aria-selected": /*active*/ ctx[18] ? "true" : "false"
    		},
    		{
    			tabindex: /*active*/ ctx[18] || /*forceAccessible*/ ctx[19]
    			? "0"
    			: "-1"
    		},
    		{ href: /*href*/ ctx[7] },
    		/*internalAttrs*/ ctx[17],
    		exclude(/*$$restProps*/ ctx[24], ["content$", "tabIndicator$"])
    	];

    	var switch_value = /*component*/ ctx[10];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot$2] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		/*switch_instance_binding*/ ctx[34](switch_instance);

    		switch_instance.$on("click", function () {
    			if (is_function(/*instance*/ ctx[11] && /*instance*/ ctx[11].handleClick())) (/*instance*/ ctx[11] && /*instance*/ ctx[11].handleClick()).apply(this, arguments);
    		});
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			const switch_instance_changes = (dirty[0] & /*ripple, addClass, removeClass, addStyle, forwardEvents, use, className, active, stacked, minWidth, internalClasses, internalStyles, style, forceAccessible, href, internalAttrs, $$restProps*/ 33521855)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty[0] & /*ripple, addClass, removeClass, addStyle, forwardEvents, use*/ 15728649 && {
    						use: [
    							[
    								Ripple,
    								{
    									ripple: /*ripple*/ ctx[3],
    									unbounded: false,
    									addClass: /*addClass*/ ctx[21],
    									removeClass: /*removeClass*/ ctx[22],
    									addStyle: /*addStyle*/ ctx[23]
    								}
    							],
    							/*forwardEvents*/ ctx[20],
    							.../*use*/ ctx[0]
    						]
    					},
    					dirty[0] & /*className, active, stacked, minWidth, internalClasses*/ 294962 && {
    						class: classMap({
    							[/*className*/ ctx[1]]: true,
    							"mdc-tab": true,
    							"mdc-tab--active": /*active*/ ctx[18],
    							"mdc-tab--stacked": /*stacked*/ ctx[4],
    							"mdc-tab--min-width": /*minWidth*/ ctx[5],
    							.../*internalClasses*/ ctx[15]
    						})
    					},
    					dirty[0] & /*internalStyles, style*/ 65540 && {
    						style: Object.entries(/*internalStyles*/ ctx[16]).map(func$1).concat([/*style*/ ctx[2]]).join(" ")
    					},
    					switch_instance_spread_levels[3],
    					dirty[0] & /*active*/ 262144 && {
    						"aria-selected": /*active*/ ctx[18] ? "true" : "false"
    					},
    					dirty[0] & /*active, forceAccessible*/ 786432 && {
    						tabindex: /*active*/ ctx[18] || /*forceAccessible*/ ctx[19]
    						? "0"
    						: "-1"
    					},
    					dirty[0] & /*href*/ 128 && { href: /*href*/ ctx[7] },
    					dirty[0] & /*internalAttrs*/ 131072 && get_spread_object(/*internalAttrs*/ ctx[17]),
    					dirty[0] & /*$$restProps*/ 16777216 && get_spread_object(exclude(/*$$restProps*/ ctx[24], ["content$", "tabIndicator$"]))
    				])
    			: {};

    			if (dirty[0] & /*active, $$restProps, tabIndicator, indicatorSpanOnlyContent, content$class, content, content$use*/ 17064768 | dirty[1] & /*$$scope*/ 16) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*component*/ ctx[10])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					/*switch_instance_binding*/ ctx[34](switch_instance);

    					switch_instance.$on("click", function () {
    						if (is_function(/*instance*/ ctx[11] && /*instance*/ ctx[11].handleClick())) (/*instance*/ ctx[11] && /*instance*/ ctx[11].handleClick()).apply(this, arguments);
    					});

    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*switch_instance_binding*/ ctx[34](null);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func$1 = ([name, value]) => `${name}: ${value};`;

    function instance_1$2($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","style","tab","ripple","stacked","minWidth","indicatorSpanOnlyContent","href","content$use","content$class","component","activate","deactivate","focus","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Tab", slots, ['default','tab-indicator']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = "" } = $$props;
    	let { style = "" } = $$props;
    	let { tab: tabId } = $$props;
    	let { ripple = true } = $$props;
    	let { stacked = false } = $$props;
    	let { minWidth = false } = $$props;
    	let { indicatorSpanOnlyContent = false } = $$props;
    	let { href = null } = $$props;
    	let { content$use = [] } = $$props;
    	let { content$class = "" } = $$props;
    	let element;
    	let instance;
    	let content;
    	let tabIndicator;
    	let internalClasses = {};
    	let internalStyles = {};
    	let internalAttrs = {};
    	let focusOnActivate = getContext("SMUI:tab:focusOnActivate");
    	let active = tabId === getContext("SMUI:tab:initialActive");
    	let forceAccessible = false;
    	let { component = href == null ? Button : A } = $$props;
    	setContext("SMUI:label:context", "tab");
    	setContext("SMUI:icon:context", "tab");

    	if (!tabId) {
    		throw new Error("The tab property is required! It should be passed down from the TabBar to the Tab.");
    	}

    	onMount(() => {
    		$$invalidate(11, instance = new MDCTabFoundation({
    				setAttr: addAttr,
    				addClass,
    				removeClass,
    				hasClass,
    				activateIndicator: previousIndicatorClientRect => tabIndicator.activate(previousIndicatorClientRect),
    				deactivateIndicator: () => tabIndicator.deactivate(),
    				notifyInteracted: () => dispatch(getElement(), "MDCTab:interacted", { tabId }),
    				getOffsetLeft: () => getElement().offsetLeft,
    				getOffsetWidth: () => getElement().offsetWidth,
    				getContentOffsetLeft: () => content.offsetLeft,
    				getContentOffsetWidth: () => content.offsetWidth,
    				focus
    			}));

    		const accessor = {
    			tabId,
    			get element() {
    				return getElement();
    			},
    			get active() {
    				return active;
    			},
    			forceAccessible(accessible) {
    				$$invalidate(19, forceAccessible = accessible);
    			},
    			computeIndicatorClientRect: () => tabIndicator.computeContentClientRect(),
    			computeDimensions: () => instance.computeDimensions(),
    			focus,
    			activate,
    			deactivate
    		};

    		dispatch(getElement(), "SMUI:tab:mount", accessor);
    		instance.init();

    		return () => {
    			dispatch(getElement(), "SMUI:tab:unmount", accessor);
    			instance.destroy();
    		};
    	});

    	function hasClass(className) {
    		return className in internalClasses
    		? internalClasses[className]
    		: getElement().classList.contains(className);
    	}

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(15, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(15, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addStyle(name, value) {
    		if (internalStyles[name] != value) {
    			if (value === "" || value == null) {
    				delete internalStyles[name];
    				$$invalidate(16, internalStyles);
    			} else {
    				$$invalidate(16, internalStyles[name] = value, internalStyles);
    			}
    		}
    	}

    	function addAttr(name, value) {
    		if (internalAttrs[name] !== value) {
    			$$invalidate(17, internalAttrs[name] = value, internalAttrs);
    		}
    	}

    	function activate(previousIndicatorClientRect, skipFocus) {
    		$$invalidate(18, active = true);

    		if (skipFocus) {
    			instance.setFocusOnActivate(false);
    		}

    		instance.activate(previousIndicatorClientRect);

    		if (skipFocus) {
    			instance.setFocusOnActivate(focusOnActivate);
    		}
    	}

    	function deactivate() {
    		$$invalidate(18, active = false);
    		instance.deactivate();
    	}

    	function focus() {
    		getElement().focus();
    	}

    	function getElement() {
    		return element.getElement();
    	}

    	function tabindicator_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			tabIndicator = $$value;
    			$$invalidate(14, tabIndicator);
    		});
    	}

    	function span0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			content = $$value;
    			$$invalidate(13, content);
    		});
    	}

    	function tabindicator_binding_1($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			tabIndicator = $$value;
    			$$invalidate(14, tabIndicator);
    		});
    	}

    	function switch_instance_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			element = $$value;
    			$$invalidate(12, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(24, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("use" in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ("class" in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ("style" in $$new_props) $$invalidate(2, style = $$new_props.style);
    		if ("tab" in $$new_props) $$invalidate(25, tabId = $$new_props.tab);
    		if ("ripple" in $$new_props) $$invalidate(3, ripple = $$new_props.ripple);
    		if ("stacked" in $$new_props) $$invalidate(4, stacked = $$new_props.stacked);
    		if ("minWidth" in $$new_props) $$invalidate(5, minWidth = $$new_props.minWidth);
    		if ("indicatorSpanOnlyContent" in $$new_props) $$invalidate(6, indicatorSpanOnlyContent = $$new_props.indicatorSpanOnlyContent);
    		if ("href" in $$new_props) $$invalidate(7, href = $$new_props.href);
    		if ("content$use" in $$new_props) $$invalidate(8, content$use = $$new_props.content$use);
    		if ("content$class" in $$new_props) $$invalidate(9, content$class = $$new_props.content$class);
    		if ("component" in $$new_props) $$invalidate(10, component = $$new_props.component);
    		if ("$$scope" in $$new_props) $$invalidate(35, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		MDCTabFoundation,
    		onMount,
    		setContext,
    		getContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		exclude,
    		prefixFilter,
    		useActions,
    		dispatch,
    		Ripple,
    		A,
    		Button,
    		TabIndicator,
    		forwardEvents,
    		use,
    		className,
    		style,
    		tabId,
    		ripple,
    		stacked,
    		minWidth,
    		indicatorSpanOnlyContent,
    		href,
    		content$use,
    		content$class,
    		element,
    		instance,
    		content,
    		tabIndicator,
    		internalClasses,
    		internalStyles,
    		internalAttrs,
    		focusOnActivate,
    		active,
    		forceAccessible,
    		component,
    		hasClass,
    		addClass,
    		removeClass,
    		addStyle,
    		addAttr,
    		activate,
    		deactivate,
    		focus,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("use" in $$props) $$invalidate(0, use = $$new_props.use);
    		if ("className" in $$props) $$invalidate(1, className = $$new_props.className);
    		if ("style" in $$props) $$invalidate(2, style = $$new_props.style);
    		if ("tabId" in $$props) $$invalidate(25, tabId = $$new_props.tabId);
    		if ("ripple" in $$props) $$invalidate(3, ripple = $$new_props.ripple);
    		if ("stacked" in $$props) $$invalidate(4, stacked = $$new_props.stacked);
    		if ("minWidth" in $$props) $$invalidate(5, minWidth = $$new_props.minWidth);
    		if ("indicatorSpanOnlyContent" in $$props) $$invalidate(6, indicatorSpanOnlyContent = $$new_props.indicatorSpanOnlyContent);
    		if ("href" in $$props) $$invalidate(7, href = $$new_props.href);
    		if ("content$use" in $$props) $$invalidate(8, content$use = $$new_props.content$use);
    		if ("content$class" in $$props) $$invalidate(9, content$class = $$new_props.content$class);
    		if ("element" in $$props) $$invalidate(12, element = $$new_props.element);
    		if ("instance" in $$props) $$invalidate(11, instance = $$new_props.instance);
    		if ("content" in $$props) $$invalidate(13, content = $$new_props.content);
    		if ("tabIndicator" in $$props) $$invalidate(14, tabIndicator = $$new_props.tabIndicator);
    		if ("internalClasses" in $$props) $$invalidate(15, internalClasses = $$new_props.internalClasses);
    		if ("internalStyles" in $$props) $$invalidate(16, internalStyles = $$new_props.internalStyles);
    		if ("internalAttrs" in $$props) $$invalidate(17, internalAttrs = $$new_props.internalAttrs);
    		if ("focusOnActivate" in $$props) $$invalidate(36, focusOnActivate = $$new_props.focusOnActivate);
    		if ("active" in $$props) $$invalidate(18, active = $$new_props.active);
    		if ("forceAccessible" in $$props) $$invalidate(19, forceAccessible = $$new_props.forceAccessible);
    		if ("component" in $$props) $$invalidate(10, component = $$new_props.component);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*instance*/ 2048) {
    			if (instance) {
    				instance.setFocusOnActivate(focusOnActivate);
    			}
    		}
    	};

    	return [
    		use,
    		className,
    		style,
    		ripple,
    		stacked,
    		minWidth,
    		indicatorSpanOnlyContent,
    		href,
    		content$use,
    		content$class,
    		component,
    		instance,
    		element,
    		content,
    		tabIndicator,
    		internalClasses,
    		internalStyles,
    		internalAttrs,
    		active,
    		forceAccessible,
    		forwardEvents,
    		addClass,
    		removeClass,
    		addStyle,
    		$$restProps,
    		tabId,
    		activate,
    		deactivate,
    		focus,
    		getElement,
    		slots,
    		tabindicator_binding,
    		span0_binding,
    		tabindicator_binding_1,
    		switch_instance_binding,
    		$$scope
    	];
    }

    class Tab extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance_1$2,
    			create_fragment$7,
    			safe_not_equal,
    			{
    				use: 0,
    				class: 1,
    				style: 2,
    				tab: 25,
    				ripple: 3,
    				stacked: 4,
    				minWidth: 5,
    				indicatorSpanOnlyContent: 6,
    				href: 7,
    				content$use: 8,
    				content$class: 9,
    				component: 10,
    				activate: 26,
    				deactivate: 27,
    				focus: 28,
    				getElement: 29
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tab",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*tabId*/ ctx[25] === undefined && !("tab" in props)) {
    			console.warn("<Tab> was created without expected prop 'tab'");
    		}
    	}

    	get use() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tab() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tab(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ripple() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ripple(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stacked() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stacked(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get minWidth() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set minWidth(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get indicatorSpanOnlyContent() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set indicatorSpanOnlyContent(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get content$use() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content$use(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get content$class() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content$class(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activate() {
    		return this.$$.ctx[26];
    	}

    	set activate(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get deactivate() {
    		return this.$$.ctx[27];
    	}

    	set deactivate(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focus() {
    		return this.$$.ctx[28];
    	}

    	set focus(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[29];
    	}

    	set getElement(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@smui/common/CommonLabel.svelte generated by Svelte v3.37.0 */
    const file$6 = "node_modules/@smui/common/CommonLabel.svelte";

    function create_fragment$6(ctx) {
    	let span;
    	let span_class_value;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let span_levels = [
    		{
    			class: span_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				"mdc-button__label": /*context*/ ctx[4] === "button",
    				"mdc-fab__label": /*context*/ ctx[4] === "fab",
    				"mdc-tab__text-label": /*context*/ ctx[4] === "tab",
    				"mdc-image-list__label": /*context*/ ctx[4] === "image-list",
    				"mdc-snackbar__label": /*context*/ ctx[4] === "snackbar",
    				"mdc-banner__text": /*context*/ ctx[4] === "banner",
    				"mdc-segmented-button__label": /*context*/ ctx[4] === "segmented-button",
    				"mdc-data-table__pagination-rows-per-page-label": /*context*/ ctx[4] === "data-table:pagination",
    				"mdc-data-table__header-cell-label": /*context*/ ctx[4] === "data-table:sortable-header-cell"
    			})
    		},
    		/*context*/ ctx[4] === "snackbar"
    		? { "aria-atomic": "false" }
    		: {},
    		{ tabindex: /*tabindex*/ ctx[5] },
    		/*$$restProps*/ ctx[6]
    	];

    	let span_data = {};

    	for (let i = 0; i < span_levels.length; i += 1) {
    		span_data = assign(span_data, span_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			set_attributes(span, span_data);
    			add_location(span, file$6, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			/*span_binding*/ ctx[10](span);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, span, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[3].call(null, span))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 256) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
    				}
    			}

    			set_attributes(span, span_data = get_spread_update(span_levels, [
    				(!current || dirty & /*className*/ 2 && span_class_value !== (span_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					"mdc-button__label": /*context*/ ctx[4] === "button",
    					"mdc-fab__label": /*context*/ ctx[4] === "fab",
    					"mdc-tab__text-label": /*context*/ ctx[4] === "tab",
    					"mdc-image-list__label": /*context*/ ctx[4] === "image-list",
    					"mdc-snackbar__label": /*context*/ ctx[4] === "snackbar",
    					"mdc-banner__text": /*context*/ ctx[4] === "banner",
    					"mdc-segmented-button__label": /*context*/ ctx[4] === "segmented-button",
    					"mdc-data-table__pagination-rows-per-page-label": /*context*/ ctx[4] === "data-table:pagination",
    					"mdc-data-table__header-cell-label": /*context*/ ctx[4] === "data-table:sortable-header-cell"
    				}))) && { class: span_class_value },
    				/*context*/ ctx[4] === "snackbar"
    				? { "aria-atomic": "false" }
    				: {},
    				{ tabindex: /*tabindex*/ ctx[5] },
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    			/*span_binding*/ ctx[10](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","class","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CommonLabel", slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = "" } = $$props;
    	let element;
    	const context = getContext("SMUI:label:context");
    	const tabindex = getContext("SMUI:label:tabindex");

    	function getElement() {
    		return element;
    	}

    	function span_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			element = $$value;
    			$$invalidate(2, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("use" in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ("class" in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ("$$scope" in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		useActions,
    		forwardEvents,
    		use,
    		className,
    		element,
    		context,
    		tabindex,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("use" in $$props) $$invalidate(0, use = $$new_props.use);
    		if ("className" in $$props) $$invalidate(1, className = $$new_props.className);
    		if ("element" in $$props) $$invalidate(2, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		element,
    		forwardEvents,
    		context,
    		tabindex,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		span_binding
    	];
    }

    class CommonLabel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$6, safe_not_equal, { use: 0, class: 1, getElement: 7 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CommonLabel",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get use() {
    		throw new Error("<CommonLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<CommonLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<CommonLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<CommonLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[7];
    	}

    	set getElement(value) {
    		throw new Error("<CommonLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses = {
        ANIMATING: 'mdc-tab-scroller--animating',
        SCROLL_AREA_SCROLL: 'mdc-tab-scroller__scroll-area--scroll',
        SCROLL_TEST: 'mdc-tab-scroller__test',
    };
    var strings$1 = {
        AREA_SELECTOR: '.mdc-tab-scroller__scroll-area',
        CONTENT_SELECTOR: '.mdc-tab-scroller__scroll-content',
    };

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCTabScrollerRTL = /** @class */ (function () {
        function MDCTabScrollerRTL(adapter) {
            this.adapter = adapter;
        }
        return MDCTabScrollerRTL;
    }());

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCTabScrollerRTLDefault = /** @class */ (function (_super) {
        __extends(MDCTabScrollerRTLDefault, _super);
        function MDCTabScrollerRTLDefault() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MDCTabScrollerRTLDefault.prototype.getScrollPositionRTL = function () {
            var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
            var right = this.calculateScrollEdges_().right;
            // Scroll values on most browsers are ints instead of floats so we round
            return Math.round(right - currentScrollLeft);
        };
        MDCTabScrollerRTLDefault.prototype.scrollToRTL = function (scrollX) {
            var edges = this.calculateScrollEdges_();
            var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
            var clampedScrollLeft = this.clampScrollValue_(edges.right - scrollX);
            return {
                finalScrollPosition: clampedScrollLeft,
                scrollDelta: clampedScrollLeft - currentScrollLeft,
            };
        };
        MDCTabScrollerRTLDefault.prototype.incrementScrollRTL = function (scrollX) {
            var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
            var clampedScrollLeft = this.clampScrollValue_(currentScrollLeft - scrollX);
            return {
                finalScrollPosition: clampedScrollLeft,
                scrollDelta: clampedScrollLeft - currentScrollLeft,
            };
        };
        MDCTabScrollerRTLDefault.prototype.getAnimatingScrollPosition = function (scrollX) {
            return scrollX;
        };
        MDCTabScrollerRTLDefault.prototype.calculateScrollEdges_ = function () {
            var contentWidth = this.adapter.getScrollContentOffsetWidth();
            var rootWidth = this.adapter.getScrollAreaOffsetWidth();
            return {
                left: 0,
                right: contentWidth - rootWidth,
            };
        };
        MDCTabScrollerRTLDefault.prototype.clampScrollValue_ = function (scrollX) {
            var edges = this.calculateScrollEdges_();
            return Math.min(Math.max(edges.left, scrollX), edges.right);
        };
        return MDCTabScrollerRTLDefault;
    }(MDCTabScrollerRTL));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCTabScrollerRTLNegative = /** @class */ (function (_super) {
        __extends(MDCTabScrollerRTLNegative, _super);
        function MDCTabScrollerRTLNegative() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MDCTabScrollerRTLNegative.prototype.getScrollPositionRTL = function (translateX) {
            var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
            return Math.round(translateX - currentScrollLeft);
        };
        MDCTabScrollerRTLNegative.prototype.scrollToRTL = function (scrollX) {
            var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
            var clampedScrollLeft = this.clampScrollValue_(-scrollX);
            return {
                finalScrollPosition: clampedScrollLeft,
                scrollDelta: clampedScrollLeft - currentScrollLeft,
            };
        };
        MDCTabScrollerRTLNegative.prototype.incrementScrollRTL = function (scrollX) {
            var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
            var clampedScrollLeft = this.clampScrollValue_(currentScrollLeft - scrollX);
            return {
                finalScrollPosition: clampedScrollLeft,
                scrollDelta: clampedScrollLeft - currentScrollLeft,
            };
        };
        MDCTabScrollerRTLNegative.prototype.getAnimatingScrollPosition = function (scrollX, translateX) {
            return scrollX - translateX;
        };
        MDCTabScrollerRTLNegative.prototype.calculateScrollEdges_ = function () {
            var contentWidth = this.adapter.getScrollContentOffsetWidth();
            var rootWidth = this.adapter.getScrollAreaOffsetWidth();
            return {
                left: rootWidth - contentWidth,
                right: 0,
            };
        };
        MDCTabScrollerRTLNegative.prototype.clampScrollValue_ = function (scrollX) {
            var edges = this.calculateScrollEdges_();
            return Math.max(Math.min(edges.right, scrollX), edges.left);
        };
        return MDCTabScrollerRTLNegative;
    }(MDCTabScrollerRTL));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCTabScrollerRTLReverse = /** @class */ (function (_super) {
        __extends(MDCTabScrollerRTLReverse, _super);
        function MDCTabScrollerRTLReverse() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MDCTabScrollerRTLReverse.prototype.getScrollPositionRTL = function (translateX) {
            var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
            // Scroll values on most browsers are ints instead of floats so we round
            return Math.round(currentScrollLeft - translateX);
        };
        MDCTabScrollerRTLReverse.prototype.scrollToRTL = function (scrollX) {
            var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
            var clampedScrollLeft = this.clampScrollValue_(scrollX);
            return {
                finalScrollPosition: clampedScrollLeft,
                scrollDelta: currentScrollLeft - clampedScrollLeft,
            };
        };
        MDCTabScrollerRTLReverse.prototype.incrementScrollRTL = function (scrollX) {
            var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
            var clampedScrollLeft = this.clampScrollValue_(currentScrollLeft + scrollX);
            return {
                finalScrollPosition: clampedScrollLeft,
                scrollDelta: currentScrollLeft - clampedScrollLeft,
            };
        };
        MDCTabScrollerRTLReverse.prototype.getAnimatingScrollPosition = function (scrollX, translateX) {
            return scrollX + translateX;
        };
        MDCTabScrollerRTLReverse.prototype.calculateScrollEdges_ = function () {
            var contentWidth = this.adapter.getScrollContentOffsetWidth();
            var rootWidth = this.adapter.getScrollAreaOffsetWidth();
            return {
                left: contentWidth - rootWidth,
                right: 0,
            };
        };
        MDCTabScrollerRTLReverse.prototype.clampScrollValue_ = function (scrollX) {
            var edges = this.calculateScrollEdges_();
            return Math.min(Math.max(edges.right, scrollX), edges.left);
        };
        return MDCTabScrollerRTLReverse;
    }(MDCTabScrollerRTL));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCTabScrollerFoundation = /** @class */ (function (_super) {
        __extends(MDCTabScrollerFoundation, _super);
        function MDCTabScrollerFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCTabScrollerFoundation.defaultAdapter), adapter)) || this;
            /**
             * Controls whether we should handle the transitionend and interaction events during the animation.
             */
            _this.isAnimating_ = false;
            return _this;
        }
        Object.defineProperty(MDCTabScrollerFoundation, "cssClasses", {
            get: function () {
                return cssClasses;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTabScrollerFoundation, "strings", {
            get: function () {
                return strings$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTabScrollerFoundation, "defaultAdapter", {
            get: function () {
                // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
                return {
                    eventTargetMatchesSelector: function () { return false; },
                    addClass: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    addScrollAreaClass: function () { return undefined; },
                    setScrollAreaStyleProperty: function () { return undefined; },
                    setScrollContentStyleProperty: function () { return undefined; },
                    getScrollContentStyleValue: function () { return ''; },
                    setScrollAreaScrollLeft: function () { return undefined; },
                    getScrollAreaScrollLeft: function () { return 0; },
                    getScrollContentOffsetWidth: function () { return 0; },
                    getScrollAreaOffsetWidth: function () { return 0; },
                    computeScrollAreaClientRect: function () { return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 }); },
                    computeScrollContentClientRect: function () { return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 }); },
                    computeHorizontalScrollbarHeight: function () { return 0; },
                };
                // tslint:enable:object-literal-sort-keys
            },
            enumerable: false,
            configurable: true
        });
        MDCTabScrollerFoundation.prototype.init = function () {
            // Compute horizontal scrollbar height on scroller with overflow initially hidden, then update overflow to scroll
            // and immediately adjust bottom margin to avoid the scrollbar initially appearing before JS runs.
            var horizontalScrollbarHeight = this.adapter.computeHorizontalScrollbarHeight();
            this.adapter.setScrollAreaStyleProperty('margin-bottom', -horizontalScrollbarHeight + 'px');
            this.adapter.addScrollAreaClass(MDCTabScrollerFoundation.cssClasses.SCROLL_AREA_SCROLL);
        };
        /**
         * Computes the current visual scroll position
         */
        MDCTabScrollerFoundation.prototype.getScrollPosition = function () {
            if (this.isRTL_()) {
                return this.computeCurrentScrollPositionRTL_();
            }
            var currentTranslateX = this.calculateCurrentTranslateX_();
            var scrollLeft = this.adapter.getScrollAreaScrollLeft();
            return scrollLeft - currentTranslateX;
        };
        /**
         * Handles interaction events that occur during transition
         */
        MDCTabScrollerFoundation.prototype.handleInteraction = function () {
            // Early exit if we aren't animating
            if (!this.isAnimating_) {
                return;
            }
            // Prevent other event listeners from handling this event
            this.stopScrollAnimation_();
        };
        /**
         * Handles the transitionend event
         */
        MDCTabScrollerFoundation.prototype.handleTransitionEnd = function (evt) {
            // Early exit if we aren't animating or the event was triggered by a different element.
            var evtTarget = evt.target;
            if (!this.isAnimating_ ||
                !this.adapter.eventTargetMatchesSelector(evtTarget, MDCTabScrollerFoundation.strings.CONTENT_SELECTOR)) {
                return;
            }
            this.isAnimating_ = false;
            this.adapter.removeClass(MDCTabScrollerFoundation.cssClasses.ANIMATING);
        };
        /**
         * Increment the scroll value by the scrollXIncrement using animation.
         * @param scrollXIncrement The value by which to increment the scroll position
         */
        MDCTabScrollerFoundation.prototype.incrementScroll = function (scrollXIncrement) {
            // Early exit for non-operational increment values
            if (scrollXIncrement === 0) {
                return;
            }
            this.animate_(this.getIncrementScrollOperation_(scrollXIncrement));
        };
        /**
         * Increment the scroll value by the scrollXIncrement without animation.
         * @param scrollXIncrement The value by which to increment the scroll position
         */
        MDCTabScrollerFoundation.prototype.incrementScrollImmediate = function (scrollXIncrement) {
            // Early exit for non-operational increment values
            if (scrollXIncrement === 0) {
                return;
            }
            var operation = this.getIncrementScrollOperation_(scrollXIncrement);
            if (operation.scrollDelta === 0) {
                return;
            }
            this.stopScrollAnimation_();
            this.adapter.setScrollAreaScrollLeft(operation.finalScrollPosition);
        };
        /**
         * Scrolls to the given scrollX value
         */
        MDCTabScrollerFoundation.prototype.scrollTo = function (scrollX) {
            if (this.isRTL_()) {
                return this.scrollToRTL_(scrollX);
            }
            this.scrollTo_(scrollX);
        };
        /**
         * @return Browser-specific {@link MDCTabScrollerRTL} instance.
         */
        MDCTabScrollerFoundation.prototype.getRTLScroller = function () {
            if (!this.rtlScrollerInstance_) {
                this.rtlScrollerInstance_ = this.rtlScrollerFactory_();
            }
            return this.rtlScrollerInstance_;
        };
        /**
         * @return translateX value from a CSS matrix transform function string.
         */
        MDCTabScrollerFoundation.prototype.calculateCurrentTranslateX_ = function () {
            var transformValue = this.adapter.getScrollContentStyleValue('transform');
            // Early exit if no transform is present
            if (transformValue === 'none') {
                return 0;
            }
            // The transform value comes back as a matrix transformation in the form
            // of `matrix(a, b, c, d, tx, ty)`. We only care about tx (translateX) so
            // we're going to grab all the parenthesized values, strip out tx, and
            // parse it.
            var match = /\((.+?)\)/.exec(transformValue);
            if (!match) {
                return 0;
            }
            var matrixParams = match[1];
            // tslint:disable-next-line:ban-ts-ignore "Unused vars" should be a linter warning, not a compiler error.
            // @ts-ignore These unused variables should retain their semantic names for clarity.
            var _a = __read(matrixParams.split(','), 6); _a[0]; _a[1]; _a[2]; _a[3]; var tx = _a[4]; _a[5];
            return parseFloat(tx); // tslint:disable-line:ban
        };
        /**
         * Calculates a safe scroll value that is > 0 and < the max scroll value
         * @param scrollX The distance to scroll
         */
        MDCTabScrollerFoundation.prototype.clampScrollValue_ = function (scrollX) {
            var edges = this.calculateScrollEdges_();
            return Math.min(Math.max(edges.left, scrollX), edges.right);
        };
        MDCTabScrollerFoundation.prototype.computeCurrentScrollPositionRTL_ = function () {
            var translateX = this.calculateCurrentTranslateX_();
            return this.getRTLScroller().getScrollPositionRTL(translateX);
        };
        MDCTabScrollerFoundation.prototype.calculateScrollEdges_ = function () {
            var contentWidth = this.adapter.getScrollContentOffsetWidth();
            var rootWidth = this.adapter.getScrollAreaOffsetWidth();
            return {
                left: 0,
                right: contentWidth - rootWidth,
            };
        };
        /**
         * Internal scroll method
         * @param scrollX The new scroll position
         */
        MDCTabScrollerFoundation.prototype.scrollTo_ = function (scrollX) {
            var currentScrollX = this.getScrollPosition();
            var safeScrollX = this.clampScrollValue_(scrollX);
            var scrollDelta = safeScrollX - currentScrollX;
            this.animate_({
                finalScrollPosition: safeScrollX,
                scrollDelta: scrollDelta,
            });
        };
        /**
         * Internal RTL scroll method
         * @param scrollX The new scroll position
         */
        MDCTabScrollerFoundation.prototype.scrollToRTL_ = function (scrollX) {
            var animation = this.getRTLScroller().scrollToRTL(scrollX);
            this.animate_(animation);
        };
        /**
         * Internal method to compute the increment scroll operation values.
         * @param scrollX The desired scroll position increment
         * @return MDCTabScrollerAnimation with the sanitized values for performing the scroll operation.
         */
        MDCTabScrollerFoundation.prototype.getIncrementScrollOperation_ = function (scrollX) {
            if (this.isRTL_()) {
                return this.getRTLScroller().incrementScrollRTL(scrollX);
            }
            var currentScrollX = this.getScrollPosition();
            var targetScrollX = scrollX + currentScrollX;
            var safeScrollX = this.clampScrollValue_(targetScrollX);
            var scrollDelta = safeScrollX - currentScrollX;
            return {
                finalScrollPosition: safeScrollX,
                scrollDelta: scrollDelta,
            };
        };
        /**
         * Animates the tab scrolling
         * @param animation The animation to apply
         */
        MDCTabScrollerFoundation.prototype.animate_ = function (animation) {
            var _this = this;
            // Early exit if translateX is 0, which means there's no animation to perform
            if (animation.scrollDelta === 0) {
                return;
            }
            this.stopScrollAnimation_();
            // This animation uses the FLIP approach.
            // Read more here: https://aerotwist.com/blog/flip-your-animations/
            this.adapter.setScrollAreaScrollLeft(animation.finalScrollPosition);
            this.adapter.setScrollContentStyleProperty('transform', "translateX(" + animation.scrollDelta + "px)");
            // Force repaint
            this.adapter.computeScrollAreaClientRect();
            requestAnimationFrame(function () {
                _this.adapter.addClass(MDCTabScrollerFoundation.cssClasses.ANIMATING);
                _this.adapter.setScrollContentStyleProperty('transform', 'none');
            });
            this.isAnimating_ = true;
        };
        /**
         * Stops scroll animation
         */
        MDCTabScrollerFoundation.prototype.stopScrollAnimation_ = function () {
            this.isAnimating_ = false;
            var currentScrollPosition = this.getAnimatingScrollPosition_();
            this.adapter.removeClass(MDCTabScrollerFoundation.cssClasses.ANIMATING);
            this.adapter.setScrollContentStyleProperty('transform', 'translateX(0px)');
            this.adapter.setScrollAreaScrollLeft(currentScrollPosition);
        };
        /**
         * Gets the current scroll position during animation
         */
        MDCTabScrollerFoundation.prototype.getAnimatingScrollPosition_ = function () {
            var currentTranslateX = this.calculateCurrentTranslateX_();
            var scrollLeft = this.adapter.getScrollAreaScrollLeft();
            if (this.isRTL_()) {
                return this.getRTLScroller().getAnimatingScrollPosition(scrollLeft, currentTranslateX);
            }
            return scrollLeft - currentTranslateX;
        };
        /**
         * Determines the RTL Scroller to use
         */
        MDCTabScrollerFoundation.prototype.rtlScrollerFactory_ = function () {
            // Browsers have three different implementations of scrollLeft in RTL mode,
            // dependent on the browser. The behavior is based off the max LTR
            // scrollLeft value and 0.
            //
            // * Default scrolling in RTL *
            //    - Left-most value: 0
            //    - Right-most value: Max LTR scrollLeft value
            //
            // * Negative scrolling in RTL *
            //    - Left-most value: Negated max LTR scrollLeft value
            //    - Right-most value: 0
            //
            // * Reverse scrolling in RTL *
            //    - Left-most value: Max LTR scrollLeft value
            //    - Right-most value: 0
            //
            // We use those principles below to determine which RTL scrollLeft
            // behavior is implemented in the current browser.
            var initialScrollLeft = this.adapter.getScrollAreaScrollLeft();
            this.adapter.setScrollAreaScrollLeft(initialScrollLeft - 1);
            var newScrollLeft = this.adapter.getScrollAreaScrollLeft();
            // If the newScrollLeft value is negative,then we know that the browser has
            // implemented negative RTL scrolling, since all other implementations have
            // only positive values.
            if (newScrollLeft < 0) {
                // Undo the scrollLeft test check
                this.adapter.setScrollAreaScrollLeft(initialScrollLeft);
                return new MDCTabScrollerRTLNegative(this.adapter);
            }
            var rootClientRect = this.adapter.computeScrollAreaClientRect();
            var contentClientRect = this.adapter.computeScrollContentClientRect();
            var rightEdgeDelta = Math.round(contentClientRect.right - rootClientRect.right);
            // Undo the scrollLeft test check
            this.adapter.setScrollAreaScrollLeft(initialScrollLeft);
            // By calculating the clientRect of the root element and the clientRect of
            // the content element, we can determine how much the scroll value changed
            // when we performed the scrollLeft subtraction above.
            if (rightEdgeDelta === newScrollLeft) {
                return new MDCTabScrollerRTLReverse(this.adapter);
            }
            return new MDCTabScrollerRTLDefault(this.adapter);
        };
        MDCTabScrollerFoundation.prototype.isRTL_ = function () {
            return this.adapter.getScrollContentStyleValue('direction') === 'rtl';
        };
        return MDCTabScrollerFoundation;
    }(MDCFoundation));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * Stores result from computeHorizontalScrollbarHeight to avoid redundant processing.
     */
    var horizontalScrollbarHeight_;
    /**
     * Computes the height of browser-rendered horizontal scrollbars using a self-created test element.
     * May return 0 (e.g. on OS X browsers under default configuration).
     */
    function computeHorizontalScrollbarHeight(documentObj, shouldCacheResult) {
        if (shouldCacheResult === void 0) { shouldCacheResult = true; }
        if (shouldCacheResult && typeof horizontalScrollbarHeight_ !== 'undefined') {
            return horizontalScrollbarHeight_;
        }
        var el = documentObj.createElement('div');
        el.classList.add(cssClasses.SCROLL_TEST);
        documentObj.body.appendChild(el);
        var horizontalScrollbarHeight = el.offsetHeight - el.clientHeight;
        documentObj.body.removeChild(el);
        if (shouldCacheResult) {
            horizontalScrollbarHeight_ = horizontalScrollbarHeight;
        }
        return horizontalScrollbarHeight;
    }

    var util = /*#__PURE__*/Object.freeze({
        __proto__: null,
        computeHorizontalScrollbarHeight: computeHorizontalScrollbarHeight
    });

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var strings = {
        ARROW_LEFT_KEY: 'ArrowLeft',
        ARROW_RIGHT_KEY: 'ArrowRight',
        END_KEY: 'End',
        ENTER_KEY: 'Enter',
        HOME_KEY: 'Home',
        SPACE_KEY: 'Space',
        TAB_ACTIVATED_EVENT: 'MDCTabBar:activated',
        TAB_SCROLLER_SELECTOR: '.mdc-tab-scroller',
        TAB_SELECTOR: '.mdc-tab',
    };
    var numbers = {
        ARROW_LEFT_KEYCODE: 37,
        ARROW_RIGHT_KEYCODE: 39,
        END_KEYCODE: 35,
        ENTER_KEYCODE: 13,
        EXTRA_SCROLL_AMOUNT: 20,
        HOME_KEYCODE: 36,
        SPACE_KEYCODE: 32,
    };

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var ACCEPTABLE_KEYS = new Set();
    // IE11 has no support for new Set with iterable so we need to initialize this by hand
    ACCEPTABLE_KEYS.add(strings.ARROW_LEFT_KEY);
    ACCEPTABLE_KEYS.add(strings.ARROW_RIGHT_KEY);
    ACCEPTABLE_KEYS.add(strings.END_KEY);
    ACCEPTABLE_KEYS.add(strings.HOME_KEY);
    ACCEPTABLE_KEYS.add(strings.ENTER_KEY);
    ACCEPTABLE_KEYS.add(strings.SPACE_KEY);
    var KEYCODE_MAP = new Map();
    // IE11 has no support for new Map with iterable so we need to initialize this by hand
    KEYCODE_MAP.set(numbers.ARROW_LEFT_KEYCODE, strings.ARROW_LEFT_KEY);
    KEYCODE_MAP.set(numbers.ARROW_RIGHT_KEYCODE, strings.ARROW_RIGHT_KEY);
    KEYCODE_MAP.set(numbers.END_KEYCODE, strings.END_KEY);
    KEYCODE_MAP.set(numbers.HOME_KEYCODE, strings.HOME_KEY);
    KEYCODE_MAP.set(numbers.ENTER_KEYCODE, strings.ENTER_KEY);
    KEYCODE_MAP.set(numbers.SPACE_KEYCODE, strings.SPACE_KEY);
    var MDCTabBarFoundation = /** @class */ (function (_super) {
        __extends(MDCTabBarFoundation, _super);
        function MDCTabBarFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCTabBarFoundation.defaultAdapter), adapter)) || this;
            _this.useAutomaticActivation_ = false;
            return _this;
        }
        Object.defineProperty(MDCTabBarFoundation, "strings", {
            get: function () {
                return strings;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTabBarFoundation, "numbers", {
            get: function () {
                return numbers;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTabBarFoundation, "defaultAdapter", {
            get: function () {
                // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
                return {
                    scrollTo: function () { return undefined; },
                    incrementScroll: function () { return undefined; },
                    getScrollPosition: function () { return 0; },
                    getScrollContentWidth: function () { return 0; },
                    getOffsetWidth: function () { return 0; },
                    isRTL: function () { return false; },
                    setActiveTab: function () { return undefined; },
                    activateTabAtIndex: function () { return undefined; },
                    deactivateTabAtIndex: function () { return undefined; },
                    focusTabAtIndex: function () { return undefined; },
                    getTabIndicatorClientRectAtIndex: function () { return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 }); },
                    getTabDimensionsAtIndex: function () { return ({ rootLeft: 0, rootRight: 0, contentLeft: 0, contentRight: 0 }); },
                    getPreviousActiveTabIndex: function () { return -1; },
                    getFocusedTabIndex: function () { return -1; },
                    getIndexOfTabById: function () { return -1; },
                    getTabListLength: function () { return 0; },
                    notifyTabActivated: function () { return undefined; },
                };
                // tslint:enable:object-literal-sort-keys
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Switches between automatic and manual activation modes.
         * See https://www.w3.org/TR/wai-aria-practices/#tabpanel for examples.
         */
        MDCTabBarFoundation.prototype.setUseAutomaticActivation = function (useAutomaticActivation) {
            this.useAutomaticActivation_ = useAutomaticActivation;
        };
        MDCTabBarFoundation.prototype.activateTab = function (index) {
            var previousActiveIndex = this.adapter.getPreviousActiveTabIndex();
            if (!this.indexIsInRange_(index) || index === previousActiveIndex) {
                return;
            }
            var previousClientRect;
            if (previousActiveIndex !== -1) {
                this.adapter.deactivateTabAtIndex(previousActiveIndex);
                previousClientRect =
                    this.adapter.getTabIndicatorClientRectAtIndex(previousActiveIndex);
            }
            this.adapter.activateTabAtIndex(index, previousClientRect);
            this.scrollIntoView(index);
            this.adapter.notifyTabActivated(index);
        };
        MDCTabBarFoundation.prototype.handleKeyDown = function (evt) {
            // Get the key from the event
            var key = this.getKeyFromEvent_(evt);
            // Early exit if the event key isn't one of the keyboard navigation keys
            if (key === undefined) {
                return;
            }
            // Prevent default behavior for movement keys, but not for activation keys, since :active is used to apply ripple
            if (!this.isActivationKey_(key)) {
                evt.preventDefault();
            }
            if (this.useAutomaticActivation_) {
                if (this.isActivationKey_(key)) {
                    return;
                }
                var index = this.determineTargetFromKey_(this.adapter.getPreviousActiveTabIndex(), key);
                this.adapter.setActiveTab(index);
                this.scrollIntoView(index);
            }
            else {
                var focusedTabIndex = this.adapter.getFocusedTabIndex();
                if (this.isActivationKey_(key)) {
                    this.adapter.setActiveTab(focusedTabIndex);
                }
                else {
                    var index = this.determineTargetFromKey_(focusedTabIndex, key);
                    this.adapter.focusTabAtIndex(index);
                    this.scrollIntoView(index);
                }
            }
        };
        /**
         * Handles the MDCTab:interacted event
         */
        MDCTabBarFoundation.prototype.handleTabInteraction = function (evt) {
            this.adapter.setActiveTab(this.adapter.getIndexOfTabById(evt.detail.tabId));
        };
        /**
         * Scrolls the tab at the given index into view
         * @param index The tab index to make visible
         */
        MDCTabBarFoundation.prototype.scrollIntoView = function (index) {
            // Early exit if the index is out of range
            if (!this.indexIsInRange_(index)) {
                return;
            }
            // Always scroll to 0 if scrolling to the 0th index
            if (index === 0) {
                return this.adapter.scrollTo(0);
            }
            // Always scroll to the max value if scrolling to the Nth index
            // MDCTabScroller.scrollTo() will never scroll past the max possible value
            if (index === this.adapter.getTabListLength() - 1) {
                return this.adapter.scrollTo(this.adapter.getScrollContentWidth());
            }
            if (this.isRTL_()) {
                return this.scrollIntoViewRTL_(index);
            }
            this.scrollIntoView_(index);
        };
        /**
         * Private method for determining the index of the destination tab based on what key was pressed
         * @param origin The original index from which to determine the destination
         * @param key The name of the key
         */
        MDCTabBarFoundation.prototype.determineTargetFromKey_ = function (origin, key) {
            var isRTL = this.isRTL_();
            var maxIndex = this.adapter.getTabListLength() - 1;
            var shouldGoToEnd = key === strings.END_KEY;
            var shouldDecrement = key === strings.ARROW_LEFT_KEY && !isRTL || key === strings.ARROW_RIGHT_KEY && isRTL;
            var shouldIncrement = key === strings.ARROW_RIGHT_KEY && !isRTL || key === strings.ARROW_LEFT_KEY && isRTL;
            var index = origin;
            if (shouldGoToEnd) {
                index = maxIndex;
            }
            else if (shouldDecrement) {
                index -= 1;
            }
            else if (shouldIncrement) {
                index += 1;
            }
            else {
                index = 0;
            }
            if (index < 0) {
                index = maxIndex;
            }
            else if (index > maxIndex) {
                index = 0;
            }
            return index;
        };
        /**
         * Calculates the scroll increment that will make the tab at the given index visible
         * @param index The index of the tab
         * @param nextIndex The index of the next tab
         * @param scrollPosition The current scroll position
         * @param barWidth The width of the Tab Bar
         */
        MDCTabBarFoundation.prototype.calculateScrollIncrement_ = function (index, nextIndex, scrollPosition, barWidth) {
            var nextTabDimensions = this.adapter.getTabDimensionsAtIndex(nextIndex);
            var relativeContentLeft = nextTabDimensions.contentLeft - scrollPosition - barWidth;
            var relativeContentRight = nextTabDimensions.contentRight - scrollPosition;
            var leftIncrement = relativeContentRight - numbers.EXTRA_SCROLL_AMOUNT;
            var rightIncrement = relativeContentLeft + numbers.EXTRA_SCROLL_AMOUNT;
            if (nextIndex < index) {
                return Math.min(leftIncrement, 0);
            }
            return Math.max(rightIncrement, 0);
        };
        /**
         * Calculates the scroll increment that will make the tab at the given index visible in RTL
         * @param index The index of the tab
         * @param nextIndex The index of the next tab
         * @param scrollPosition The current scroll position
         * @param barWidth The width of the Tab Bar
         * @param scrollContentWidth The width of the scroll content
         */
        MDCTabBarFoundation.prototype.calculateScrollIncrementRTL_ = function (index, nextIndex, scrollPosition, barWidth, scrollContentWidth) {
            var nextTabDimensions = this.adapter.getTabDimensionsAtIndex(nextIndex);
            var relativeContentLeft = scrollContentWidth - nextTabDimensions.contentLeft - scrollPosition;
            var relativeContentRight = scrollContentWidth - nextTabDimensions.contentRight - scrollPosition - barWidth;
            var leftIncrement = relativeContentRight + numbers.EXTRA_SCROLL_AMOUNT;
            var rightIncrement = relativeContentLeft - numbers.EXTRA_SCROLL_AMOUNT;
            if (nextIndex > index) {
                return Math.max(leftIncrement, 0);
            }
            return Math.min(rightIncrement, 0);
        };
        /**
         * Determines the index of the adjacent tab closest to either edge of the Tab Bar
         * @param index The index of the tab
         * @param tabDimensions The dimensions of the tab
         * @param scrollPosition The current scroll position
         * @param barWidth The width of the tab bar
         */
        MDCTabBarFoundation.prototype.findAdjacentTabIndexClosestToEdge_ = function (index, tabDimensions, scrollPosition, barWidth) {
            /**
             * Tabs are laid out in the Tab Scroller like this:
             *
             *    Scroll Position
             *    +---+
             *    |   |   Bar Width
             *    |   +-----------------------------------+
             *    |   |                                   |
             *    |   V                                   V
             *    |   +-----------------------------------+
             *    V   |             Tab Scroller          |
             *    +------------+--------------+-------------------+
             *    |    Tab     |      Tab     |        Tab        |
             *    +------------+--------------+-------------------+
             *        |                                   |
             *        +-----------------------------------+
             *
             * To determine the next adjacent index, we look at the Tab root left and
             * Tab root right, both relative to the scroll position. If the Tab root
             * left is less than 0, then we know it's out of view to the left. If the
             * Tab root right minus the bar width is greater than 0, we know the Tab is
             * out of view to the right. From there, we either increment or decrement
             * the index.
             */
            var relativeRootLeft = tabDimensions.rootLeft - scrollPosition;
            var relativeRootRight = tabDimensions.rootRight - scrollPosition - barWidth;
            var relativeRootDelta = relativeRootLeft + relativeRootRight;
            var leftEdgeIsCloser = relativeRootLeft < 0 || relativeRootDelta < 0;
            var rightEdgeIsCloser = relativeRootRight > 0 || relativeRootDelta > 0;
            if (leftEdgeIsCloser) {
                return index - 1;
            }
            if (rightEdgeIsCloser) {
                return index + 1;
            }
            return -1;
        };
        /**
         * Determines the index of the adjacent tab closest to either edge of the Tab Bar in RTL
         * @param index The index of the tab
         * @param tabDimensions The dimensions of the tab
         * @param scrollPosition The current scroll position
         * @param barWidth The width of the tab bar
         * @param scrollContentWidth The width of the scroller content
         */
        MDCTabBarFoundation.prototype.findAdjacentTabIndexClosestToEdgeRTL_ = function (index, tabDimensions, scrollPosition, barWidth, scrollContentWidth) {
            var rootLeft = scrollContentWidth - tabDimensions.rootLeft - barWidth - scrollPosition;
            var rootRight = scrollContentWidth - tabDimensions.rootRight - scrollPosition;
            var rootDelta = rootLeft + rootRight;
            var leftEdgeIsCloser = rootLeft > 0 || rootDelta > 0;
            var rightEdgeIsCloser = rootRight < 0 || rootDelta < 0;
            if (leftEdgeIsCloser) {
                return index + 1;
            }
            if (rightEdgeIsCloser) {
                return index - 1;
            }
            return -1;
        };
        /**
         * Returns the key associated with a keydown event
         * @param evt The keydown event
         */
        MDCTabBarFoundation.prototype.getKeyFromEvent_ = function (evt) {
            if (ACCEPTABLE_KEYS.has(evt.key)) {
                return evt.key;
            }
            return KEYCODE_MAP.get(evt.keyCode);
        };
        MDCTabBarFoundation.prototype.isActivationKey_ = function (key) {
            return key === strings.SPACE_KEY || key === strings.ENTER_KEY;
        };
        /**
         * Returns whether a given index is inclusively between the ends
         * @param index The index to test
         */
        MDCTabBarFoundation.prototype.indexIsInRange_ = function (index) {
            return index >= 0 && index < this.adapter.getTabListLength();
        };
        /**
         * Returns the view's RTL property
         */
        MDCTabBarFoundation.prototype.isRTL_ = function () {
            return this.adapter.isRTL();
        };
        /**
         * Scrolls the tab at the given index into view for left-to-right user agents.
         * @param index The index of the tab to scroll into view
         */
        MDCTabBarFoundation.prototype.scrollIntoView_ = function (index) {
            var scrollPosition = this.adapter.getScrollPosition();
            var barWidth = this.adapter.getOffsetWidth();
            var tabDimensions = this.adapter.getTabDimensionsAtIndex(index);
            var nextIndex = this.findAdjacentTabIndexClosestToEdge_(index, tabDimensions, scrollPosition, barWidth);
            if (!this.indexIsInRange_(nextIndex)) {
                return;
            }
            var scrollIncrement = this.calculateScrollIncrement_(index, nextIndex, scrollPosition, barWidth);
            this.adapter.incrementScroll(scrollIncrement);
        };
        /**
         * Scrolls the tab at the given index into view in RTL
         * @param index The tab index to make visible
         */
        MDCTabBarFoundation.prototype.scrollIntoViewRTL_ = function (index) {
            var scrollPosition = this.adapter.getScrollPosition();
            var barWidth = this.adapter.getOffsetWidth();
            var tabDimensions = this.adapter.getTabDimensionsAtIndex(index);
            var scrollWidth = this.adapter.getScrollContentWidth();
            var nextIndex = this.findAdjacentTabIndexClosestToEdgeRTL_(index, tabDimensions, scrollPosition, barWidth, scrollWidth);
            if (!this.indexIsInRange_(nextIndex)) {
                return;
            }
            var scrollIncrement = this.calculateScrollIncrementRTL_(index, nextIndex, scrollPosition, barWidth, scrollWidth);
            this.adapter.incrementScroll(scrollIncrement);
        };
        return MDCTabBarFoundation;
    }(MDCFoundation));

    /* node_modules/@smui/tab-scroller/TabScroller.svelte generated by Svelte v3.37.0 */

    const file$5 = "node_modules/@smui/tab-scroller/TabScroller.svelte";

    function create_fragment$5(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let div0_class_value;
    	let div0_style_value;
    	let useActions_action;
    	let div1_class_value;
    	let div1_style_value;
    	let useActions_action_1;
    	let div2_class_value;
    	let useActions_action_2;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[23].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[22], null);

    	let div0_levels = [
    		{
    			class: div0_class_value = classMap({
    				[/*scrollContent$class*/ ctx[6]]: true,
    				"mdc-tab-scroller__scroll-content": true
    			})
    		},
    		{
    			style: div0_style_value = Object.entries(/*scrollContentStyles*/ ctx[14]).map(func).join(" ")
    		},
    		prefixFilter(/*$$restProps*/ ctx[16], "scrollContent$")
    	];

    	let div0_data = {};

    	for (let i = 0; i < div0_levels.length; i += 1) {
    		div0_data = assign(div0_data, div0_levels[i]);
    	}

    	let div1_levels = [
    		{
    			class: div1_class_value = classMap({
    				[/*scrollArea$class*/ ctx[4]]: true,
    				"mdc-tab-scroller__scroll-area": true,
    				.../*scrollAreaClasses*/ ctx[12]
    			})
    		},
    		{
    			style: div1_style_value = Object.entries(/*scrollAreaStyles*/ ctx[13]).map(func_1).join(" ")
    		},
    		prefixFilter(/*$$restProps*/ ctx[16], "scrollArea$")
    	];

    	let div1_data = {};

    	for (let i = 0; i < div1_levels.length; i += 1) {
    		div1_data = assign(div1_data, div1_levels[i]);
    	}

    	let div2_levels = [
    		{
    			class: div2_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				"mdc-tab-scroller": true,
    				"mdc-tab-scroller--align-start": /*align*/ ctx[2] === "start",
    				"mdc-tab-scroller--align-end": /*align*/ ctx[2] === "end",
    				"mdc-tab-scroller--align-center": /*align*/ ctx[2] === "center",
    				.../*internalClasses*/ ctx[11]
    			})
    		},
    		exclude(/*$$restProps*/ ctx[16], ["scrollArea$", "scrollContent$"])
    	];

    	let div2_data = {};

    	for (let i = 0; i < div2_levels.length; i += 1) {
    		div2_data = assign(div2_data, div2_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div0, div0_data);
    			add_location(div0, file$5, 32, 4, 1108);
    			set_attributes(div1, div1_data);
    			add_location(div1, file$5, 14, 2, 406);
    			set_attributes(div2, div2_data);
    			add_location(div2, file$5, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			/*div0_binding*/ ctx[24](div0);
    			/*div1_binding*/ ctx[26](div1);
    			/*div2_binding*/ ctx[32](div2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, div0, /*scrollContent$use*/ ctx[5])),
    					listen_dev(div0, "transitionend", /*transitionend_handler*/ ctx[25], false, false, false),
    					action_destroyer(useActions_action_1 = useActions.call(null, div1, /*scrollArea$use*/ ctx[3])),
    					listen_dev(div1, "wheel", /*wheel_handler*/ ctx[27], { passive: true }, false, false),
    					listen_dev(div1, "touchstart", /*touchstart_handler*/ ctx[28], { passive: true }, false, false),
    					listen_dev(div1, "pointerdown", /*pointerdown_handler*/ ctx[29], false, false, false),
    					listen_dev(div1, "mousedown", /*mousedown_handler*/ ctx[30], false, false, false),
    					listen_dev(div1, "keydown", /*keydown_handler*/ ctx[31], false, false, false),
    					action_destroyer(useActions_action_2 = useActions.call(null, div2, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[15].call(null, div2))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty[0] & /*$$scope*/ 4194304) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[22], dirty, null, null);
    				}
    			}

    			set_attributes(div0, div0_data = get_spread_update(div0_levels, [
    				(!current || dirty[0] & /*scrollContent$class*/ 64 && div0_class_value !== (div0_class_value = classMap({
    					[/*scrollContent$class*/ ctx[6]]: true,
    					"mdc-tab-scroller__scroll-content": true
    				}))) && { class: div0_class_value },
    				(!current || dirty[0] & /*scrollContentStyles*/ 16384 && div0_style_value !== (div0_style_value = Object.entries(/*scrollContentStyles*/ ctx[14]).map(func).join(" "))) && { style: div0_style_value },
    				dirty[0] & /*$$restProps*/ 65536 && prefixFilter(/*$$restProps*/ ctx[16], "scrollContent$")
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty[0] & /*scrollContent$use*/ 32) useActions_action.update.call(null, /*scrollContent$use*/ ctx[5]);

    			set_attributes(div1, div1_data = get_spread_update(div1_levels, [
    				(!current || dirty[0] & /*scrollArea$class, scrollAreaClasses*/ 4112 && div1_class_value !== (div1_class_value = classMap({
    					[/*scrollArea$class*/ ctx[4]]: true,
    					"mdc-tab-scroller__scroll-area": true,
    					.../*scrollAreaClasses*/ ctx[12]
    				}))) && { class: div1_class_value },
    				(!current || dirty[0] & /*scrollAreaStyles*/ 8192 && div1_style_value !== (div1_style_value = Object.entries(/*scrollAreaStyles*/ ctx[13]).map(func_1).join(" "))) && { style: div1_style_value },
    				dirty[0] & /*$$restProps*/ 65536 && prefixFilter(/*$$restProps*/ ctx[16], "scrollArea$")
    			]));

    			if (useActions_action_1 && is_function(useActions_action_1.update) && dirty[0] & /*scrollArea$use*/ 8) useActions_action_1.update.call(null, /*scrollArea$use*/ ctx[3]);

    			set_attributes(div2, div2_data = get_spread_update(div2_levels, [
    				(!current || dirty[0] & /*className, align, internalClasses*/ 2054 && div2_class_value !== (div2_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					"mdc-tab-scroller": true,
    					"mdc-tab-scroller--align-start": /*align*/ ctx[2] === "start",
    					"mdc-tab-scroller--align-end": /*align*/ ctx[2] === "end",
    					"mdc-tab-scroller--align-center": /*align*/ ctx[2] === "center",
    					.../*internalClasses*/ ctx[11]
    				}))) && { class: div2_class_value },
    				dirty[0] & /*$$restProps*/ 65536 && exclude(/*$$restProps*/ ctx[16], ["scrollArea$", "scrollContent$"])
    			]));

    			if (useActions_action_2 && is_function(useActions_action_2.update) && dirty[0] & /*use*/ 1) useActions_action_2.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (default_slot) default_slot.d(detaching);
    			/*div0_binding*/ ctx[24](null);
    			/*div1_binding*/ ctx[26](null);
    			/*div2_binding*/ ctx[32](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = ([name, value]) => `${name}: ${value};`;
    const func_1 = ([name, value]) => `${name}: ${value};`;

    function instance_1$1($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","align","scrollArea$use","scrollArea$class","scrollContent$use","scrollContent$class","getScrollPosition","getScrollContentWidth","incrementScroll","scrollTo","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("TabScroller", slots, ['default']);
    	const { matches } = ponyfill;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = "" } = $$props;
    	let { align = null } = $$props;
    	let { scrollArea$use = [] } = $$props;
    	let { scrollArea$class = "" } = $$props;
    	let { scrollContent$use = [] } = $$props;
    	let { scrollContent$class = "" } = $$props;
    	let element;
    	let instance;
    	let scrollArea;
    	let scrollContent;
    	let internalClasses = {};
    	let scrollAreaClasses = {};
    	let scrollAreaStyles = {};
    	let scrollContentStyles = {};

    	onMount(() => {
    		$$invalidate(8, instance = new MDCTabScrollerFoundation({
    				eventTargetMatchesSelector: (evtTarget, selector) => matches(evtTarget, selector),
    				addClass,
    				removeClass,
    				addScrollAreaClass,
    				setScrollAreaStyleProperty: addScrollAreaStyle,
    				setScrollContentStyleProperty: addScrollContentStyle,
    				getScrollContentStyleValue: getScrollContentStyle,
    				setScrollAreaScrollLeft: scrollX => $$invalidate(9, scrollArea.scrollLeft = scrollX, scrollArea),
    				getScrollAreaScrollLeft: () => scrollArea.scrollLeft,
    				getScrollContentOffsetWidth: () => scrollContent.offsetWidth,
    				getScrollAreaOffsetWidth: () => scrollArea.offsetWidth,
    				computeScrollAreaClientRect: () => scrollArea.getBoundingClientRect(),
    				computeScrollContentClientRect: () => scrollContent.getBoundingClientRect(),
    				computeHorizontalScrollbarHeight: () => computeHorizontalScrollbarHeight(document)
    			}));

    		instance.init();

    		return () => {
    			instance.destroy();
    		};
    	});

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(11, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(11, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addScrollAreaClass(className) {
    		if (!scrollAreaClasses[className]) {
    			$$invalidate(12, scrollAreaClasses[className] = true, scrollAreaClasses);
    		}
    	}

    	function addScrollAreaStyle(name, value) {
    		if (scrollAreaStyles[name] != value) {
    			if (value === "" || value == null) {
    				delete scrollAreaStyles[name];
    				$$invalidate(13, scrollAreaStyles);
    			} else {
    				$$invalidate(13, scrollAreaStyles[name] = value, scrollAreaStyles);
    			}
    		}
    	}

    	function addScrollContentStyle(name, value) {
    		if (scrollContentStyles[name] != value) {
    			if (value === "" || value == null) {
    				delete scrollContentStyles[name];
    				$$invalidate(14, scrollContentStyles);
    			} else {
    				$$invalidate(14, scrollContentStyles[name] = value, scrollContentStyles);
    			}
    		}
    	}

    	function getScrollContentStyle(name) {
    		return name in scrollContentStyles
    		? scrollContentStyles[name]
    		: getComputedStyle(scrollContent).getPropertyValue(name);
    	}

    	function getScrollPosition() {
    		return instance.getScrollPosition();
    	}

    	function getScrollContentWidth() {
    		return scrollContent.offsetWidth;
    	}

    	function incrementScroll(scrollXIncrement) {
    		instance.incrementScroll(scrollXIncrement);
    	}

    	function scrollTo(scrollX) {
    		instance.scrollTo(scrollX);
    	}

    	function getElement() {
    		return element;
    	}

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			scrollContent = $$value;
    			$$invalidate(10, scrollContent);
    		});
    	}

    	const transitionend_handler = event => instance && instance.handleTransitionEnd(event);

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			scrollArea = $$value;
    			$$invalidate(9, scrollArea);
    		});
    	}

    	const wheel_handler = () => instance && instance.handleInteraction();
    	const touchstart_handler = () => instance && instance.handleInteraction();
    	const pointerdown_handler = () => instance && instance.handleInteraction();
    	const mousedown_handler = () => instance && instance.handleInteraction();
    	const keydown_handler = () => instance && instance.handleInteraction();

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			element = $$value;
    			$$invalidate(7, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(16, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("use" in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ("class" in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ("align" in $$new_props) $$invalidate(2, align = $$new_props.align);
    		if ("scrollArea$use" in $$new_props) $$invalidate(3, scrollArea$use = $$new_props.scrollArea$use);
    		if ("scrollArea$class" in $$new_props) $$invalidate(4, scrollArea$class = $$new_props.scrollArea$class);
    		if ("scrollContent$use" in $$new_props) $$invalidate(5, scrollContent$use = $$new_props.scrollContent$use);
    		if ("scrollContent$class" in $$new_props) $$invalidate(6, scrollContent$class = $$new_props.scrollContent$class);
    		if ("$$scope" in $$new_props) $$invalidate(22, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		MDCTabScrollerFoundation,
    		util,
    		ponyfill,
    		onMount,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		exclude,
    		prefixFilter,
    		useActions,
    		matches,
    		forwardEvents,
    		use,
    		className,
    		align,
    		scrollArea$use,
    		scrollArea$class,
    		scrollContent$use,
    		scrollContent$class,
    		element,
    		instance,
    		scrollArea,
    		scrollContent,
    		internalClasses,
    		scrollAreaClasses,
    		scrollAreaStyles,
    		scrollContentStyles,
    		addClass,
    		removeClass,
    		addScrollAreaClass,
    		addScrollAreaStyle,
    		addScrollContentStyle,
    		getScrollContentStyle,
    		getScrollPosition,
    		getScrollContentWidth,
    		incrementScroll,
    		scrollTo,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("use" in $$props) $$invalidate(0, use = $$new_props.use);
    		if ("className" in $$props) $$invalidate(1, className = $$new_props.className);
    		if ("align" in $$props) $$invalidate(2, align = $$new_props.align);
    		if ("scrollArea$use" in $$props) $$invalidate(3, scrollArea$use = $$new_props.scrollArea$use);
    		if ("scrollArea$class" in $$props) $$invalidate(4, scrollArea$class = $$new_props.scrollArea$class);
    		if ("scrollContent$use" in $$props) $$invalidate(5, scrollContent$use = $$new_props.scrollContent$use);
    		if ("scrollContent$class" in $$props) $$invalidate(6, scrollContent$class = $$new_props.scrollContent$class);
    		if ("element" in $$props) $$invalidate(7, element = $$new_props.element);
    		if ("instance" in $$props) $$invalidate(8, instance = $$new_props.instance);
    		if ("scrollArea" in $$props) $$invalidate(9, scrollArea = $$new_props.scrollArea);
    		if ("scrollContent" in $$props) $$invalidate(10, scrollContent = $$new_props.scrollContent);
    		if ("internalClasses" in $$props) $$invalidate(11, internalClasses = $$new_props.internalClasses);
    		if ("scrollAreaClasses" in $$props) $$invalidate(12, scrollAreaClasses = $$new_props.scrollAreaClasses);
    		if ("scrollAreaStyles" in $$props) $$invalidate(13, scrollAreaStyles = $$new_props.scrollAreaStyles);
    		if ("scrollContentStyles" in $$props) $$invalidate(14, scrollContentStyles = $$new_props.scrollContentStyles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		align,
    		scrollArea$use,
    		scrollArea$class,
    		scrollContent$use,
    		scrollContent$class,
    		element,
    		instance,
    		scrollArea,
    		scrollContent,
    		internalClasses,
    		scrollAreaClasses,
    		scrollAreaStyles,
    		scrollContentStyles,
    		forwardEvents,
    		$$restProps,
    		getScrollPosition,
    		getScrollContentWidth,
    		incrementScroll,
    		scrollTo,
    		getElement,
    		$$scope,
    		slots,
    		div0_binding,
    		transitionend_handler,
    		div1_binding,
    		wheel_handler,
    		touchstart_handler,
    		pointerdown_handler,
    		mousedown_handler,
    		keydown_handler,
    		div2_binding
    	];
    }

    class TabScroller extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance_1$1,
    			create_fragment$5,
    			safe_not_equal,
    			{
    				use: 0,
    				class: 1,
    				align: 2,
    				scrollArea$use: 3,
    				scrollArea$class: 4,
    				scrollContent$use: 5,
    				scrollContent$class: 6,
    				getScrollPosition: 17,
    				getScrollContentWidth: 18,
    				incrementScroll: 19,
    				scrollTo: 20,
    				getElement: 21
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabScroller",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get use() {
    		throw new Error("<TabScroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<TabScroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get align() {
    		throw new Error("<TabScroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set align(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollArea$use() {
    		throw new Error("<TabScroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrollArea$use(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollArea$class() {
    		throw new Error("<TabScroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrollArea$class(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollContent$use() {
    		throw new Error("<TabScroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrollContent$use(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollContent$class() {
    		throw new Error("<TabScroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrollContent$class(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getScrollPosition() {
    		return this.$$.ctx[17];
    	}

    	set getScrollPosition(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getScrollContentWidth() {
    		return this.$$.ctx[18];
    	}

    	set getScrollContentWidth(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get incrementScroll() {
    		return this.$$.ctx[19];
    	}

    	set incrementScroll(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollTo() {
    		return this.$$.ctx[20];
    	}

    	set scrollTo(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[21];
    	}

    	set getElement(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@smui/tab-bar/TabBar.svelte generated by Svelte v3.37.0 */
    const file$4 = "node_modules/@smui/tab-bar/TabBar.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[34] = i;
    	return child_ctx;
    }

    const get_default_slot_changes = dirty => ({ tab: dirty[0] & /*tabs*/ 4 });
    const get_default_slot_context = ctx => ({ tab: /*tab*/ ctx[32] });

    // (21:4) {#each tabs as tab, i (key(tab))}
    function create_each_block$1(key_2, ctx) {
    	let first;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[27], get_default_slot_context);

    	const block = {
    		key: key_2,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (default_slot) default_slot.c();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && dirty[0] & /*$$scope, tabs*/ 134217732) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[27], dirty, get_default_slot_changes, get_default_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(21:4) {#each tabs as tab, i (key(tab))}",
    		ctx
    	});

    	return block;
    }

    // (17:2) <TabScroller     bind:this={tabScroller}     {...prefixFilter($$restProps, 'tabScroller$')}   >
    function create_default_slot$1(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*tabs*/ ctx[2];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*key*/ ctx[3](/*tab*/ ctx[32]);
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$$scope, tabs, key*/ 134217740) {
    				each_value = /*tabs*/ ctx[2];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$1, each_1_anchor, get_each_context$1);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(17:2) <TabScroller     bind:this={tabScroller}     {...prefixFilter($$restProps, 'tabScroller$')}   >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let tabscroller;
    	let div_class_value;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const tabscroller_spread_levels = [prefixFilter(/*$$restProps*/ ctx[10], "tabScroller$")];

    	let tabscroller_props = {
    		$$slots: { default: [create_default_slot$1] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < tabscroller_spread_levels.length; i += 1) {
    		tabscroller_props = assign(tabscroller_props, tabscroller_spread_levels[i]);
    	}

    	tabscroller = new TabScroller({ props: tabscroller_props, $$inline: true });
    	/*tabscroller_binding*/ ctx[21](tabscroller);

    	let div_levels = [
    		{
    			class: div_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				"mdc-tab-bar": true
    			})
    		},
    		{ role: "tablist" },
    		exclude(/*$$restProps*/ ctx[10], ["tabScroller$"])
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(tabscroller.$$.fragment);
    			set_attributes(div, div_data);
    			add_location(div, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(tabscroller, div, null);
    			/*div_binding*/ ctx[22](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, div, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[7].call(null, div)),
    					listen_dev(div, "SMUI:tab:mount", /*SMUI_tab_mount_handler*/ ctx[23], false, false, false),
    					listen_dev(div, "SMUI:tab:unmount", /*SMUI_tab_unmount_handler*/ ctx[24], false, false, false),
    					listen_dev(div, "keydown", /*keydown_handler*/ ctx[25], false, false, false),
    					listen_dev(div, "MDCTab:interacted", /*MDCTab_interacted_handler*/ ctx[26], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const tabscroller_changes = (dirty[0] & /*$$restProps*/ 1024)
    			? get_spread_update(tabscroller_spread_levels, [get_spread_object(prefixFilter(/*$$restProps*/ ctx[10], "tabScroller$"))])
    			: {};

    			if (dirty[0] & /*$$scope, tabs*/ 134217732) {
    				tabscroller_changes.$$scope = { dirty, ctx };
    			}

    			tabscroller.$set(tabscroller_changes);

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty[0] & /*className*/ 2 && div_class_value !== (div_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					"mdc-tab-bar": true
    				}))) && { class: div_class_value },
    				{ role: "tablist" },
    				dirty[0] & /*$$restProps*/ 1024 && exclude(/*$$restProps*/ ctx[10], ["tabScroller$"])
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty[0] & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabscroller.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabscroller.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*tabscroller_binding*/ ctx[21](null);
    			destroy_component(tabscroller);
    			/*div_binding*/ ctx[22](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance_1($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","tabs","key","focusOnActivate","focusOnProgrammatic","useAutomaticActivation","active","scrollIntoView","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("TabBar", slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = "" } = $$props;
    	let { tabs = [] } = $$props;
    	let { key = tab => tab } = $$props;
    	let { focusOnActivate = true } = $$props;
    	let { focusOnProgrammatic = false } = $$props;
    	let { useAutomaticActivation = true } = $$props;
    	let { active = null } = $$props;
    	let element;
    	let instance;
    	let tabScroller;
    	let activeIndex = tabs.indexOf(active);
    	let tabAccessorMap = {};
    	let tabAccessorWeakMap = new WeakMap();
    	let skipFocus = false;
    	setContext("SMUI:tab:focusOnActivate", focusOnActivate);
    	setContext("SMUI:tab:initialActive", active);

    	onMount(() => {
    		$$invalidate(4, instance = new MDCTabBarFoundation({
    				scrollTo: scrollX => tabScroller.scrollTo(scrollX),
    				incrementScroll: scrollXIncrement => tabScroller.incrementScroll(scrollXIncrement),
    				getScrollPosition: () => tabScroller.getScrollPosition(),
    				getScrollContentWidth: () => tabScroller.getScrollContentWidth(),
    				getOffsetWidth: () => getElement().offsetWidth,
    				isRTL: () => getComputedStyle(getElement()).getPropertyValue("direction") === "rtl",
    				setActiveTab: index => {
    					$$invalidate(11, active = tabs[index]);
    					$$invalidate(17, activeIndex = index);
    					instance.activateTab(index);
    				},
    				activateTabAtIndex: (index, clientRect) => getAccessor(tabs[index]).activate(clientRect, skipFocus),
    				deactivateTabAtIndex: index => getAccessor(tabs[index]).deactivate(),
    				focusTabAtIndex: index => getAccessor(tabs[index]).focus(),
    				getTabIndicatorClientRectAtIndex: index => getAccessor(tabs[index]).computeIndicatorClientRect(),
    				getTabDimensionsAtIndex: index => getAccessor(tabs[index]).computeDimensions(),
    				getPreviousActiveTabIndex: () => {
    					for (let i = 0; i < tabs.length; i++) {
    						if (getAccessor(tabs[i]).active) {
    							return i;
    						}
    					}

    					return -1;
    				},
    				getFocusedTabIndex: () => {
    					const tabElements = tabs.map(tab => getAccessor(tab).element);
    					const activeElement = document.activeElement;
    					return tabElements.indexOf(activeElement);
    				},
    				getIndexOfTabById: id => tabs.indexOf(id),
    				getTabListLength: () => tabs.length,
    				notifyTabActivated: index => dispatch(getElement(), "MDCTabBar:activated", { index })
    			}));

    		instance.init();

    		return () => {
    			instance.destroy();
    		};
    	});

    	function handleTabMount(event) {
    		const accessor = event.detail;
    		addAccessor(accessor.tabId, accessor);
    	}

    	function handleTabUnmount(event) {
    		const accessor = event.detail;
    		removeAccessor(accessor.tabId);
    	}

    	function getAccessor(tabId) {
    		return tabId instanceof Object
    		? tabAccessorWeakMap.get(tabId)
    		: tabAccessorMap[tabId];
    	}

    	function addAccessor(tabId, accessor) {
    		if (tabId instanceof Object) {
    			tabAccessorWeakMap.set(tabId, accessor);
    			$$invalidate(19, tabAccessorWeakMap);
    		} else {
    			$$invalidate(18, tabAccessorMap[tabId] = accessor, tabAccessorMap);
    			$$invalidate(18, tabAccessorMap);
    		}
    	}

    	function removeAccessor(tabId) {
    		if (tabId instanceof Object) {
    			tabAccessorWeakMap.delete(tabId);
    			$$invalidate(19, tabAccessorWeakMap);
    		} else {
    			delete tabAccessorMap[tabId];
    			$$invalidate(18, tabAccessorMap);
    		}
    	}

    	function scrollIntoView(index) {
    		instance.scrollIntoView(index);
    	}

    	function getElement() {
    		return element;
    	}

    	function tabscroller_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			tabScroller = $$value;
    			$$invalidate(6, tabScroller);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			element = $$value;
    			$$invalidate(5, element);
    		});
    	}

    	const SMUI_tab_mount_handler = event => handleTabMount(event);
    	const SMUI_tab_unmount_handler = event => handleTabUnmount(event);
    	const keydown_handler = event => instance && instance.handleKeyDown(event);
    	const MDCTab_interacted_handler = event => instance && instance.handleTabInteraction(event);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(10, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("use" in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ("class" in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ("tabs" in $$new_props) $$invalidate(2, tabs = $$new_props.tabs);
    		if ("key" in $$new_props) $$invalidate(3, key = $$new_props.key);
    		if ("focusOnActivate" in $$new_props) $$invalidate(12, focusOnActivate = $$new_props.focusOnActivate);
    		if ("focusOnProgrammatic" in $$new_props) $$invalidate(13, focusOnProgrammatic = $$new_props.focusOnProgrammatic);
    		if ("useAutomaticActivation" in $$new_props) $$invalidate(14, useAutomaticActivation = $$new_props.useAutomaticActivation);
    		if ("active" in $$new_props) $$invalidate(11, active = $$new_props.active);
    		if ("$$scope" in $$new_props) $$invalidate(27, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		MDCTabBarFoundation,
    		onMount,
    		setContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		exclude,
    		prefixFilter,
    		useActions,
    		dispatch,
    		TabScroller,
    		forwardEvents,
    		use,
    		className,
    		tabs,
    		key,
    		focusOnActivate,
    		focusOnProgrammatic,
    		useAutomaticActivation,
    		active,
    		element,
    		instance,
    		tabScroller,
    		activeIndex,
    		tabAccessorMap,
    		tabAccessorWeakMap,
    		skipFocus,
    		handleTabMount,
    		handleTabUnmount,
    		getAccessor,
    		addAccessor,
    		removeAccessor,
    		scrollIntoView,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("use" in $$props) $$invalidate(0, use = $$new_props.use);
    		if ("className" in $$props) $$invalidate(1, className = $$new_props.className);
    		if ("tabs" in $$props) $$invalidate(2, tabs = $$new_props.tabs);
    		if ("key" in $$props) $$invalidate(3, key = $$new_props.key);
    		if ("focusOnActivate" in $$props) $$invalidate(12, focusOnActivate = $$new_props.focusOnActivate);
    		if ("focusOnProgrammatic" in $$props) $$invalidate(13, focusOnProgrammatic = $$new_props.focusOnProgrammatic);
    		if ("useAutomaticActivation" in $$props) $$invalidate(14, useAutomaticActivation = $$new_props.useAutomaticActivation);
    		if ("active" in $$props) $$invalidate(11, active = $$new_props.active);
    		if ("element" in $$props) $$invalidate(5, element = $$new_props.element);
    		if ("instance" in $$props) $$invalidate(4, instance = $$new_props.instance);
    		if ("tabScroller" in $$props) $$invalidate(6, tabScroller = $$new_props.tabScroller);
    		if ("activeIndex" in $$props) $$invalidate(17, activeIndex = $$new_props.activeIndex);
    		if ("tabAccessorMap" in $$props) $$invalidate(18, tabAccessorMap = $$new_props.tabAccessorMap);
    		if ("tabAccessorWeakMap" in $$props) $$invalidate(19, tabAccessorWeakMap = $$new_props.tabAccessorWeakMap);
    		if ("skipFocus" in $$props) skipFocus = $$new_props.skipFocus;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*active, tabs, activeIndex, instance, focusOnProgrammatic*/ 141332) {
    			if (active !== tabs[activeIndex]) {
    				$$invalidate(17, activeIndex = tabs.indexOf(active));

    				if (instance) {
    					skipFocus = !focusOnProgrammatic;
    					instance.activateTab(activeIndex);
    					skipFocus = false;
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*tabs, tabAccessorWeakMap, tabAccessorMap, activeIndex*/ 917508) {
    			if (tabs.length) {
    				// Manually get the accessor so it is reactive.
    				const accessor = tabs[0] instanceof Object
    				? tabAccessorWeakMap.get(tabs[0])
    				: tabAccessorMap[tabs[0]];

    				if (accessor) {
    					accessor.forceAccessible(activeIndex === -1);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*instance, useAutomaticActivation*/ 16400) {
    			if (instance) {
    				instance.setUseAutomaticActivation(useAutomaticActivation);
    			}
    		}
    	};

    	return [
    		use,
    		className,
    		tabs,
    		key,
    		instance,
    		element,
    		tabScroller,
    		forwardEvents,
    		handleTabMount,
    		handleTabUnmount,
    		$$restProps,
    		active,
    		focusOnActivate,
    		focusOnProgrammatic,
    		useAutomaticActivation,
    		scrollIntoView,
    		getElement,
    		activeIndex,
    		tabAccessorMap,
    		tabAccessorWeakMap,
    		slots,
    		tabscroller_binding,
    		div_binding,
    		SMUI_tab_mount_handler,
    		SMUI_tab_unmount_handler,
    		keydown_handler,
    		MDCTab_interacted_handler,
    		$$scope
    	];
    }

    class TabBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance_1,
    			create_fragment$4,
    			safe_not_equal,
    			{
    				use: 0,
    				class: 1,
    				tabs: 2,
    				key: 3,
    				focusOnActivate: 12,
    				focusOnProgrammatic: 13,
    				useAutomaticActivation: 14,
    				active: 11,
    				scrollIntoView: 15,
    				getElement: 16
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabBar",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get use() {
    		throw new Error("<TabBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<TabBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabs() {
    		throw new Error("<TabBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabs(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<TabBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusOnActivate() {
    		throw new Error("<TabBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusOnActivate(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusOnProgrammatic() {
    		throw new Error("<TabBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusOnProgrammatic(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get useAutomaticActivation() {
    		throw new Error("<TabBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set useAutomaticActivation(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<TabBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollIntoView() {
    		return this.$$.ctx[15];
    	}

    	set scrollIntoView(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[16];
    	}

    	set getElement(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/FloatWindow.svelte generated by Svelte v3.37.0 */
    const file$3 = "src/FloatWindow.svelte";

    // (126:0) {#if use_smoke }
    function create_if_block$2(ctx) {
    	let div;
    	let t;
    	let div_id_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text("...");
    			attr_dev(div, "id", div_id_value = "smoke_" + /*index*/ ctx[2]);
    			attr_dev(div, "class", "smoke svelte-6mxcwp");
    			add_location(div, file$3, 126, 0, 3313);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*index*/ 4 && div_id_value !== (div_id_value = "smoke_" + /*index*/ ctx[2])) {
    				attr_dev(div, "id", div_id_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(126:0) {#if use_smoke }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let t0;
    	let div1;
    	let div0;
    	let t1;
    	let t2;
    	let span;
    	let t3;
    	let span_id_value;
    	let div0_id_value;
    	let t4;
    	let p;
    	let t6;
    	let div1_id_value;
    	let current;
    	let if_block = /*use_smoke*/ ctx[1] && create_if_block$2(ctx);
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			t1 = text(/*title*/ ctx[0]);
    			t2 = space();
    			span = element("span");
    			t3 = text("[X]");
    			t4 = space();
    			p = element("p");
    			p.textContent = "Press ESC to close window.";
    			t6 = space();
    			if (default_slot) default_slot.c();
    			attr_dev(span, "id", span_id_value = "btn_close_" + /*index*/ ctx[2]);
    			attr_dev(span, "class", "btn_close svelte-6mxcwp");
    			add_location(span, file$3, 131, 3, 3471);
    			attr_dev(div0, "id", div0_id_value = "popup_bar_" + /*index*/ ctx[2]);
    			attr_dev(div0, "class", "popup_bar svelte-6mxcwp");
    			add_location(div0, file$3, 129, 1, 3409);
    			set_style(p, "font-size", "0.75em");
    			set_style(p, "font-weight", "bold");
    			set_style(p, "color", "darkgreen");
    			set_style(p, "padding-left", "4px");
    			add_location(p, file$3, 133, 2, 3540);
    			attr_dev(div1, "id", div1_id_value = "popup_" + /*index*/ ctx[2]);
    			attr_dev(div1, "class", "popup svelte-6mxcwp");
    			add_location(div1, file$3, 128, 0, 3367);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, span);
    			append_dev(span, t3);
    			append_dev(div1, t4);
    			append_dev(div1, p);
    			append_dev(div1, t6);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*use_smoke*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty & /*title*/ 1) set_data_dev(t1, /*title*/ ctx[0]);

    			if (!current || dirty & /*index*/ 4 && span_id_value !== (span_id_value = "btn_close_" + /*index*/ ctx[2])) {
    				attr_dev(span, "id", span_id_value);
    			}

    			if (!current || dirty & /*index*/ 4 && div0_id_value !== (div0_id_value = "popup_bar_" + /*index*/ ctx[2])) {
    				attr_dev(div0, "id", div0_id_value);
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 16) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*index*/ 4 && div1_id_value !== (div1_id_value = "popup_" + /*index*/ ctx[2])) {
    				attr_dev(div1, "id", div1_id_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function fix_height(ii, startup_delta) {
    	let txt_area = document.getElementById("blg-window-full-text");

    	if (txt_area) {
    		//
    		txt_area._blg_app_resized = true;

    		//
    		let r = txt_area.getBoundingClientRect();

    		//
    		var popup = document.getElementById(`popup_${ii}`);

    		if (popup) {
    			let rp = popup.getBoundingClientRect();
    			let h = Math.floor(rp.bottom - r.top) - startup_delta;
    			txt_area.style.height = h + "px";
    		}
    	}
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("FloatWindow", slots, ['default']);
    	let { title } = $$props;
    	let { scale_size } = $$props;
    	let { use_smoke = true } = $$props;
    	let { index = 0 } = $$props;
    	var SCROLL_WIDTH = 24;

    	// 
    	//-- let the popup make draggable & movable.
    	var offset = { x: 0, y: 0 };

    	onMount(() => {
    		//
    		document.getElementById(`popup_${index}`);

    		var popup_bar = document.getElementById(`popup_bar_${index}`);
    		var btn_close = document.getElementById(`btn_close_${index}`);
    		var smoke = document.getElementById(`smoke_${index}`);

    		//
    		popup_bar.addEventListener("mousedown", mouseDown, false);

    		window.addEventListener("mouseup", mouseUp, false);

    		window.onkeydown = e => {
    			if (e.keyCode == 27) {
    				// if ESC key pressed
    				document.getElementById(`btn_close_${index}`);

    				//btn_close.click(e);
    				var popup = document.getElementById(`popup_${index}`);

    				popup.style.display = "none";
    				if (smoke) smoke.style.display = "none";
    			}
    		};

    		btn_close.onclick = e => {
    			var popup = document.getElementById(`popup_${index}`);
    			popup.style.display = "none";
    			if (smoke) smoke.style.display = "none";
    		};

    		window.addEventListener("resize", e => {
    			spreadSmoke(use_smoke);
    		});

    		window.start_floating_window = index => {
    			popup_starter(index);
    		};
    	});

    	function popup_starter(ii) {
    		spreadSmoke(use_smoke);
    		var popup = document.getElementById(`popup_${ii}`);

    		if (popup.style.display !== "block") {
    			popup.style.top = "4px";
    			popup.style.left = "4px";
    			popup.style.width = window.innerWidth * scale_size.w - SCROLL_WIDTH + "px";
    			popup.style.height = window.innerHeight * scale_size.h - SCROLL_WIDTH + "px";
    			popup.style.display = "block";

    			setTimeout(
    				() => {
    					fix_height(ii, 4);
    				},
    				40
    			);
    		}

    		setTimeout(
    			() => {
    				fix_height(ii, 4);
    			},
    			20
    		);
    	}

    	function mouseUp() {
    		window.removeEventListener("mousemove", popupMove, true);
    	}

    	function mouseDown(e) {
    		var popup = document.getElementById(`popup_${index}`);
    		offset.x = e.clientX - popup.offsetLeft;
    		offset.y = e.clientY - popup.offsetTop;
    		window.addEventListener("mousemove", popupMove, true);
    	}

    	function popupMove(e) {
    		var popup = document.getElementById(`popup_${index}`);
    		popup.style.position = "absolute";
    		var top = e.clientY - offset.y;
    		var left = e.clientX - offset.x;
    		popup.style.top = top + "px";
    		popup.style.left = left + "px";
    	}

    	//-- / let the popup make draggable & movable.
    	function spreadSmoke(flg) {
    		if (flg) {
    			var smoke = document.getElementById(`smoke_${index}`);

    			if (smoke) {
    				if (smoke) smoke.style.width = window.outerWidth + 100 + "px";
    				if (smoke) smoke.style.height = window.outerHeight + 100 + "px";
    				if (smoke && flg != undefined && flg == true) smoke.style.display = "block";
    			}
    		}
    	}

    	const writable_props = ["title", "scale_size", "use_smoke", "index"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FloatWindow> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("scale_size" in $$props) $$invalidate(3, scale_size = $$props.scale_size);
    		if ("use_smoke" in $$props) $$invalidate(1, use_smoke = $$props.use_smoke);
    		if ("index" in $$props) $$invalidate(2, index = $$props.index);
    		if ("$$scope" in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		title,
    		scale_size,
    		use_smoke,
    		index,
    		onMount,
    		SCROLL_WIDTH,
    		offset,
    		fix_height,
    		popup_starter,
    		mouseUp,
    		mouseDown,
    		popupMove,
    		spreadSmoke
    	});

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("scale_size" in $$props) $$invalidate(3, scale_size = $$props.scale_size);
    		if ("use_smoke" in $$props) $$invalidate(1, use_smoke = $$props.use_smoke);
    		if ("index" in $$props) $$invalidate(2, index = $$props.index);
    		if ("SCROLL_WIDTH" in $$props) SCROLL_WIDTH = $$props.SCROLL_WIDTH;
    		if ("offset" in $$props) offset = $$props.offset;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, use_smoke, index, scale_size, $$scope, slots];
    }

    class FloatWindow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			title: 0,
    			scale_size: 3,
    			use_smoke: 1,
    			index: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FloatWindow",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !("title" in props)) {
    			console.warn("<FloatWindow> was created without expected prop 'title'");
    		}

    		if (/*scale_size*/ ctx[3] === undefined && !("scale_size" in props)) {
    			console.warn("<FloatWindow> was created without expected prop 'scale_size'");
    		}
    	}

    	get title() {
    		throw new Error("<FloatWindow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<FloatWindow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scale_size() {
    		throw new Error("<FloatWindow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scale_size(value) {
    		throw new Error("<FloatWindow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get use_smoke() {
    		throw new Error("<FloatWindow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use_smoke(value) {
    		throw new Error("<FloatWindow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<FloatWindow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<FloatWindow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/MessageDisplay.svelte generated by Svelte v3.37.0 */

    const file$2 = "src/MessageDisplay.svelte";

    function create_fragment$2(ctx) {
    	let div6;
    	let div4;
    	let span0;
    	let t0;
    	let t1;
    	let h4;
    	let t2;
    	let t3;
    	let div1;
    	let div0;
    	let t4;
    	let t5;
    	let t6_value = (/*business*/ ctx[5] ? "business" : "person") + "";
    	let t6;
    	let t7;
    	let button;
    	let t9;
    	let div2;
    	let span1;
    	let t11;
    	let t12;
    	let t13;
    	let div3;
    	let span2;
    	let t15;
    	let t16;
    	let t17;
    	let span3;
    	let t19;
    	let div5;
    	let t20;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div4 = element("div");
    			span0 = element("span");
    			t0 = text(/*date*/ ctx[3]);
    			t1 = space();
    			h4 = element("h4");
    			t2 = text(/*name*/ ctx[1]);
    			t3 = space();
    			div1 = element("div");
    			div0 = element("div");
    			t4 = text(/*name*/ ctx[1]);
    			t5 = text(" is a ");
    			t6 = text(t6_value);
    			t7 = space();
    			button = element("button");
    			button.textContent = "Reply";
    			t9 = space();
    			div2 = element("div");
    			span1 = element("span");
    			span1.textContent = "Sent to:";
    			t11 = text("  ");
    			t12 = text(/*readers*/ ctx[4]);
    			t13 = space();
    			div3 = element("div");
    			span2 = element("span");
    			span2.textContent = "subject";
    			t15 = text("  ");
    			t16 = text(/*subject*/ ctx[2]);
    			t17 = space();
    			span3 = element("span");
    			span3.textContent = "Compose message here";
    			t19 = space();
    			div5 = element("div");
    			t20 = space();
    			input = element("input");
    			set_style(span0, "background-color", "yellowgreen");
    			attr_dev(span0, "class", "svelte-1ppr3w4");
    			add_location(span0, file$2, 20, 2, 339);
    			attr_dev(h4, "class", "blg-item-title svelte-1ppr3w4");
    			set_style(h4, "background-color", "inherit");
    			add_location(h4, file$2, 21, 2, 399);
    			attr_dev(div0, "class", "little-info svelte-1ppr3w4");
    			add_location(div0, file$2, 23, 3, 484);
    			add_location(button, file$2, 26, 3, 576);
    			add_location(div1, file$2, 22, 2, 475);
    			set_style(span1, "background-color", "navy");
    			attr_dev(span1, "class", "svelte-1ppr3w4");
    			add_location(span1, file$2, 29, 3, 640);
    			add_location(div2, file$2, 28, 2, 631);
    			set_style(span2, "background-color", "navy");
    			attr_dev(span2, "class", "svelte-1ppr3w4");
    			add_location(span2, file$2, 32, 3, 733);
    			add_location(div3, file$2, 31, 2, 724);
    			set_style(div4, "padding", "6px");
    			add_location(div4, file$2, 19, 1, 309);
    			attr_dev(span3, "class", "svelte-1ppr3w4");
    			add_location(span3, file$2, 35, 1, 823);
    			attr_dev(div5, "id", "blg-window-full-text");
    			attr_dev(div5, "class", "full-display svelte-1ppr3w4");
    			add_location(div5, file$2, 36, 1, 858);
    			attr_dev(input, "type", "hidden");
    			attr_dev(input, "id", "pub-key");
    			add_location(input, file$2, 39, 1, 940);
    			attr_dev(div6, "class", "blg-el-wrapper-full svelte-1ppr3w4");
    			add_location(div6, file$2, 18, 0, 273);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div4);
    			append_dev(div4, span0);
    			append_dev(span0, t0);
    			append_dev(div4, t1);
    			append_dev(div4, h4);
    			append_dev(h4, t2);
    			append_dev(div4, t3);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div0, t4);
    			append_dev(div0, t5);
    			append_dev(div0, t6);
    			append_dev(div1, t7);
    			append_dev(div1, button);
    			append_dev(div4, t9);
    			append_dev(div4, div2);
    			append_dev(div2, span1);
    			append_dev(div2, t11);
    			append_dev(div2, t12);
    			append_dev(div4, t13);
    			append_dev(div4, div3);
    			append_dev(div3, span2);
    			append_dev(div3, t15);
    			append_dev(div3, t16);
    			append_dev(div6, t17);
    			append_dev(div6, span3);
    			append_dev(div6, t19);
    			append_dev(div6, div5);
    			div5.innerHTML = /*message*/ ctx[6];
    			append_dev(div6, t20);
    			append_dev(div6, input);
    			set_input_value(input, /*public_key*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*do_reply*/ ctx[7], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[8])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*date*/ 8) set_data_dev(t0, /*date*/ ctx[3]);
    			if (dirty & /*name*/ 2) set_data_dev(t2, /*name*/ ctx[1]);
    			if (dirty & /*name*/ 2) set_data_dev(t4, /*name*/ ctx[1]);
    			if (dirty & /*business*/ 32 && t6_value !== (t6_value = (/*business*/ ctx[5] ? "business" : "person") + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*readers*/ 16) set_data_dev(t12, /*readers*/ ctx[4]);
    			if (dirty & /*subject*/ 4) set_data_dev(t16, /*subject*/ ctx[2]);
    			if (dirty & /*message*/ 64) div5.innerHTML = /*message*/ ctx[6];
    			if (dirty & /*public_key*/ 1) {
    				set_input_value(input, /*public_key*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("MessageDisplay", slots, []);
    	let { name } = $$props;
    	let { subject } = $$props;
    	let { date } = $$props;
    	let { readers } = $$props;
    	let { business } = $$props;
    	let { public_key } = $$props;
    	let { message } = $$props;

    	function do_reply() {
    		alert(subject);
    	}

    	const writable_props = ["name", "subject", "date", "readers", "business", "public_key", "message"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MessageDisplay> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		public_key = this.value;
    		$$invalidate(0, public_key);
    	}

    	$$self.$$set = $$props => {
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("subject" in $$props) $$invalidate(2, subject = $$props.subject);
    		if ("date" in $$props) $$invalidate(3, date = $$props.date);
    		if ("readers" in $$props) $$invalidate(4, readers = $$props.readers);
    		if ("business" in $$props) $$invalidate(5, business = $$props.business);
    		if ("public_key" in $$props) $$invalidate(0, public_key = $$props.public_key);
    		if ("message" in $$props) $$invalidate(6, message = $$props.message);
    	};

    	$$self.$capture_state = () => ({
    		name,
    		subject,
    		date,
    		readers,
    		business,
    		public_key,
    		message,
    		do_reply
    	});

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("subject" in $$props) $$invalidate(2, subject = $$props.subject);
    		if ("date" in $$props) $$invalidate(3, date = $$props.date);
    		if ("readers" in $$props) $$invalidate(4, readers = $$props.readers);
    		if ("business" in $$props) $$invalidate(5, business = $$props.business);
    		if ("public_key" in $$props) $$invalidate(0, public_key = $$props.public_key);
    		if ("message" in $$props) $$invalidate(6, message = $$props.message);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		public_key,
    		name,
    		subject,
    		date,
    		readers,
    		business,
    		message,
    		do_reply,
    		input_input_handler
    	];
    }

    class MessageDisplay extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			name: 1,
    			subject: 2,
    			date: 3,
    			readers: 4,
    			business: 5,
    			public_key: 0,
    			message: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MessageDisplay",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[1] === undefined && !("name" in props)) {
    			console.warn("<MessageDisplay> was created without expected prop 'name'");
    		}

    		if (/*subject*/ ctx[2] === undefined && !("subject" in props)) {
    			console.warn("<MessageDisplay> was created without expected prop 'subject'");
    		}

    		if (/*date*/ ctx[3] === undefined && !("date" in props)) {
    			console.warn("<MessageDisplay> was created without expected prop 'date'");
    		}

    		if (/*readers*/ ctx[4] === undefined && !("readers" in props)) {
    			console.warn("<MessageDisplay> was created without expected prop 'readers'");
    		}

    		if (/*business*/ ctx[5] === undefined && !("business" in props)) {
    			console.warn("<MessageDisplay> was created without expected prop 'business'");
    		}

    		if (/*public_key*/ ctx[0] === undefined && !("public_key" in props)) {
    			console.warn("<MessageDisplay> was created without expected prop 'public_key'");
    		}

    		if (/*message*/ ctx[6] === undefined && !("message" in props)) {
    			console.warn("<MessageDisplay> was created without expected prop 'message'");
    		}
    	}

    	get name() {
    		throw new Error("<MessageDisplay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<MessageDisplay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get subject() {
    		throw new Error("<MessageDisplay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subject(value) {
    		throw new Error("<MessageDisplay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get date() {
    		throw new Error("<MessageDisplay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set date(value) {
    		throw new Error("<MessageDisplay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get readers() {
    		throw new Error("<MessageDisplay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set readers(value) {
    		throw new Error("<MessageDisplay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get business() {
    		throw new Error("<MessageDisplay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set business(value) {
    		throw new Error("<MessageDisplay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get public_key() {
    		throw new Error("<MessageDisplay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set public_key(value) {
    		throw new Error("<MessageDisplay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get message() {
    		throw new Error("<MessageDisplay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<MessageDisplay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    const CONTACTS = 'contacts';
    const MANIFEST  = 'manifest';
    const TOPICS = 'topics';


    var alert_error = (msg) => {
        alert(msg);
        console.log(new Error("stack"));
    };

    function set_alert_error_handler(fn) {
        if ( typeof fn === 'function' ) {
            alert_error = fn;
        }
    }

    var g_profile_port = '6111';
    function correct_server(srvr) {
        srvr = srvr.replace('5111','6111');   /// CHANGE ...
        return srvr
    }



    // -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------
    // ASSETS


    async function fetch_asset(topics_cid,user_cid,asset) {  // specifically from this user
        let srver = location.host;
        srver = correct_server(srver);
        //
        let prot = location.protocol;  // prot for (prot)ocol
        
        let data_stem = `get-asset/${asset}`;
        let sp = '//';
        let post_data = {
            "cid" : topics_cid
        };
        let search_result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data);
        if ( search_result ) {
            let data = search_result.data;
            let decryptor = window.user_decryption(user_cid,asset);
            if ( decryptor !== undefined ) {
                try {
                    data = decryptor(data);
                } catch (e) {
                }
            }
            if ( data ) {
                let data_obj = JSON.parse(data);
                try {
                    return data_obj
                } catch (e) {
                }
            }
        }
    }


    async function fetch_contacts(contacts_cid,user_cid) {  // specifically from this user
        return await fetch_asset(contacts_cid,user_cid,CONTACTS)
    }

    async function fetch_manifest(manifest_cid,user_cid) {  // specifically from this user
        return await fetch_asset(manifest_cid,user_cid,MANIFEST)
    }

    async function fetch_topicst(topics_cid,user_cid) {  // specifically from this user
        return await fetch_asset(topics_cid,user_cid,TOPICS)
    }


    // -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------
    // ASSETS


    async function update_asset_to_ipfs(asset,user_cid,is_business,contents) {
        let srver = location.host;
        srver = correct_server(srver);
        //
        if ( typeof contents !== 'string' ) {
            contents = JSON.stringify(contents);
        }
        let encryptor = window.user_encryption(user_cid,asset);
        let encoded_contents = contents;
        if ( encryptor !== undefined ) {
            encoded_contents = encryptor(contents);
        }
        //
        let prot = location.protocol;  // prot for (prot)ocol
        let data_stem = `put-asset/${asset}`;
        let sp = '//';
        let post_data = {
            "cid" : user_cid,
            "business" : is_business,
            "contents" : encoded_contents
        };
        let result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data);
        if ( result.status === "OK" ) {
            return result.update_cid
        }
        return false
    }


    async function update_contacts_to_ipfs(user_cid,is_business,contents) {
        return await update_asset_to_ipfs(CONTACTS,user_cid,is_business,contents)
    }

    async function update_manifest_to_ipfs(user_cid,is_business,contents) {
        return await update_asset_to_ipfs(MANIFEST,user_cid,is_business,contents)
    }

    async function update_topics_to_ipfs(user_cid,is_business,contents) {
        return await update_asset_to_ipfs(TOPICS,user_cid,is_business,contents)
    }

    // // contact page
    // -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------


    async function fetch_contact_page(asset,contact_cid) {  // specifically from this user
        let srver = location.host;
        srver = correct_server(srver);
        //
        let prot = location.protocol;  // prot for (prot)ocol
        if ( contact_cid !== undefined ) {
            asset = 'cid';
        }
        let data_stem = `get-contact-page/${asset}`;
        let sp = '//';

        let post_data = {
            "cid" : contact_cid
        };
        let search_result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data);
        if ( search_result ) {
            let data = search_result.data;
            let decryptor = window.user_decryption(user_cid,asset);
            if ( decryptor !== undefined ) {
                try {
                    data = decryptor(data);
                } catch (e) {
                }
            }
            if ( data ) {
                let data_obj = JSON.parse(data);
                try {
                    return data_obj
                } catch (e) {
                }
            }
        }
    }

    // // 
    // -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------

    let g_user_fields = ["name", "DOB", "place_of_origin", "cool_public_info", "business", "public_key"];
    // not checking for "cid" for most cases...
    async function add_profile(u_info) {
        let user_info = Object.assign(u_info);
        //
        for ( let field of g_user_fields ) {
            if ( user_info[field] === undefined ) {
                if ( field ===  "public_key" ) {
                    let p_key = get_user_public_wrapper_key(`${user_info.name}-${user_info.DOB}`);
                    if ( p_key ) {
                        user_info[field] = p_key;
                        continue
                    }
                }
                alert_error("undefined field " + field);
                return
            }
        }
        if ( user_info.cid !== undefined ) {        // remove reference to a cid when adding a new profile...
            delete user_info.cid;
        }
        let srver = location.host;
        srver = correct_server(srver);
        //
        let prot = location.protocol;  // prot for (prot)ocol
        let data_stem = 'add/profile';
        let sp = '//';
        let post_data = user_info;
        let result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data);
        if ( result.status === "OK" ) {
            let ipfs_identity = result.data;
            // "id" : cid with key,
            // "clear_id" : cid without key,
            // "dir_data" : user directory structure
            u_info.cid = ipfs_identity.id;
            await store_user(u_info,ipfs_identity);
            return true
        }
        return false
    }


    async function fetch_contact_cid(someones_info,clear) {  // a user,, not the owner of the manifest, most likely a recipients
        let user_info = Object.assign({},someones_info); 
        for ( let field of g_user_fields ) {
            if ( user_info[field] === undefined ) {
                if ( (field === "public_key") && clear ) {
                    delete user_info.public_key;
                }
                alert_error("undefined field " + field);
                return
            }
        }
        let srver = location.host;
        srver = correct_server(srver);
        //
        let prot = location.protocol;  // prot for (prot)ocol
        let data_stem = 'get/user-cid';
        let sp = '//';
        let post_data = user_info;
        let result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data);
        if ( result.status === "OK" ) {
            let cid = result.cid;
            return cid
        }
        return false
    }



    async function get_dir(user_info,clear) {
        //
        for ( let field of g_user_fields ) {
            if ( user_info[field] === undefined ) {
                if ( (field === "public_key")  && !(clear) ) {
                    let p_key = get_user_public_wrapper_key(`${user_info.name}-${user_info.DOB}`);
                    if ( p_key ) {
                        user_info[field] = p_key;
                        continue
                    }
                }
                alert_error("undefined field " + field);
                return
            }
        }
        //
        if ( clear ) {
            delete user_info.public_key; 
        }
        //
        let srver = location.host;
        srver = correct_server(srver);
        //
        let prot = location.protocol;  // prot for (prot)ocol
        let data_stem = 'dir';
        let sp = '//';
        let post_data = user_info;
        let result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data);
        if ( result.status === "OK" ) {
            let dir_tree = result.data;
            try {
                dir_tree = JSON.parse(dir_tree);
                return dir_tree
            } catch (e) {}
        }
        return false
    }
    async function send_kind_of_message(m_path,recipient_info,user_info,message,clear) {
        //
        for ( let field of g_user_fields ) {
            if ( user_info[field] === undefined ) {
                // public_key is the public wrapper key (asymmetric)
                if ( field ===  "public_key" ) {  // always send the wrapper key (although not a wrapped_key) especially for an introduction
                    let p_key = get_user_public_wrapper_key(`${user_info.name}-${user_info.DOB}`);
                    if ( p_key ) {
                        user_info[field] = p_key;
                        continue
                    }
                }
                alert_error("undefined field " + field);
                return
            }
        }
        //
        let recipient = Object.assign({},recipient_info);
        for ( let field of g_user_fields ) {
            if ( (field === "wrapped_key")  && clear ) {     // when wrapping a key use the recipients public wrapper key
                delete recipient_info.wrapped_key;            // delete wrapped key from messages that are introductions, etc. It won't be used
                continue
            }
            if ( recipient[field] === undefined ) {
                alert_error("undefined field " + field);
                return
            }
        }

        let sendable_message = {};
        sendable_message.when = Date.now();
        sendable_message.date = (new Date(message.when)).toISOString();
        //

        sendable_message.name = user_info.name;       // from
        sendable_message.user_cid = user_info.cid;    // cid of from
        sendable_message.public_key = user_info.public_key;  // basically says we know the recipient (we have talked)
                                                            // the recipient will wrap key with this (so refresh his memory)
        if ( clear ) {
            sendable_message = message;
            // the id of the clear directory ignores the key.
            // the identity of established contact messages requires the public (so it stays for not clear)
            delete recipient.public_key;  // this has to do with the identiy and the directory where introductions go.
        }

        if ( !clear ) {
            let key_to_wrap = window.gen_cipher_key(user_info);
            if ( key_to_wrap === undefined ) {
                alert_error("could not get key ");
                return
            } else {
                sendable_message.message = JSON.stringify(message);
                let encryptor = window.user_encryption(user_cid,"message");
                let encoded_contents = sendable_message.message; 
                if ( encryptor !== undefined ) {
                    encoded_contents = encryptor(contents,key_to_wrap);
                }
                sendable_message.message = encoded_contents;
                sendable_message.wrapped_key = window.key_wrapper(key_to_wrap,recipient.public_key);
            }
        }
        //
        let srver = location.host;
        srver = correct_server(srver);
        //
        let prot = location.protocol;  // prot for (prot)ocol
        let data_stem = m_path;
        let sp = '//';
        let post_data = {
            "receiver" : recipient,
            "message" : sendable_message
        };
        let result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data);
        if ( result.status === "OK" ) {
            let m_cid = result.message_cid;
            return m_cid
        }
        return false
    }


    async function send_message(recipient_info,user_info,message) {
        let m_path = '/send/message';
        let result = await send_kind_of_message(m_path,recipient_info,user_info,message,false);
        return result
    }


    async function send_introduction(recipient_info,user_info,message) {
        let m_path = '/send/introduction';
        let result = await send_kind_of_message(m_path,recipient_info,user_info,message,true);
        return result
    }


    async function send_topic(recipient_info,user_info,message) {
        let m_path = '/send/topic';
        let result = await send_kind_of_message(m_path,recipient_info,user_info,message,false);
        return result
    }


    async function send_topic_offer(recipient_info,user_info,message) {
        let m_path = '/send/topic_offer';
        let result = await send_kind_of_message(m_path,recipient_info,user_info,message,true);
        return result
    }

    // -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------

    async function* message_decryptor(messages,identity) {
        let priv_key = identity.priv_key;
        for ( let message of messages ) {
            let wrapped_key = message.wrapped_key;
            try {
                message.message = await window.decipher_message(message.message,wrapped_key,priv_key);
                yield message;    
            } catch (e) {}
        }
    }

    async function clarify_message(messages) {
        let clear_messages = [];
        try {
            for await (let message of message_decryptor(messages,identity) ) {
                clear_messages.push(message);
            }
        } catch (e) {
            console.log('caught', e);
        }
        return(clear_messages)
    }


    async function get_spool_files(identity,spool_select,clear,offset,count) {
        //
        let cid = identity.cid;
        if ( clear ) {
            cid = identity.clear_cid;
        }
        if ( cid === undefined ) return false
        //
        let srver = location.host;
        srver = correct_server(srver);
        //
        let prot = location.protocol;  // prot for (prot)ocol
        let data_stem = 'get-spool';
        let sp = '//';
        let post_data = {
            'cid' : cid,
            'spool' : spool_select,  // false for introduction
            'business' : identity.user_info.business,
            'offset' : offset,
            'count' : count
        };
        let result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data);
        if ( result.status === "OK" ) {
            let messages = result.data;
            try {
                messages = JSON.parse(messages);
                if ( !clear ) {
                    messages = await clarify_message(messages,identity);
                }
                return messages
            } catch (e) {}
        }
        return false
    }


    async function get_message_files(user_info,offset,count) {
        let expected_messages = await get_spool_files(user_info,true,false,offset,count);
        let solicitations = await get_spool_files(user_info,true,true,offset,count);
        return [expected_messages,solicitations]
    }

    async function get_topic_files(user_info,offset,count) {
        let expected_messages = await get_spool_files(user_info,false,false,offset,count);
        let solicitations = await get_spool_files(user_info,false,true,offset,count);
        return [expected_messages,solicitations]
    }


    // -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- -------- --------
    //
    //  PUBLIC TEMPLATES AVAILABLE FROM DESIGNERS....
    //

    async function get_template_list(offset,count,category) {
        //
        if ( category === undefined ) {
            category = 'any';
        }
        //
        let cid = user_info.cid;
        if ( cid === undefined ) return false
        //
        let srver = location.host;
        srver = correct_server(srver);
        //
        let prot = location.protocol;  // prot for (prot)ocol
        let data_stem = `template-list/${category}`;
        let sp = '//';
        let post_data = {
            'category' : category,
            'business' : user_info.business,
            'start' : offset,
            'count' : count
        };
        let result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data);
        if ( result.status === "OK" ) {
            let t_list = result.data;
            try {
                t_list = JSON.parse(t_list);
                return t_list
            } catch (e) {}
        }
        return false
    }


    async function get_contact_template(template_cid) {
        //
        let data_stem = `get/template/${template_cid}`;
        let result = await fetchEndPoint(data_stem,g_profile_port);
        if ( result.status === "OK" ) {
            let contact_template = result.data;
            try {
                t_list = JSON.parse(contact_template);
                return contact_template
            } catch (e) {}
        }
        return false
    }

    async function put_contact_template(name,data) {
        //
        let srver = location.host;
        srver = correct_server(srver);
        //
        let prot = location.protocol;  // prot for (prot)ocol
        let data_stem = 'put/template/${template_cid}';
        let sp = '//';
        let post_data = {
            'name' : name,
            'uri_encoded_json' : encodeURIComponent(data)
        };
        let result = await postData(`${prot}${sp}${srver}/${data_stem}`, post_data);
        if ( result.status === "OK" ) {
            let t_cid = result.template_cid;
            return t_cid
        }
        return false
    }




    /*		MANIFEST EDITING
    //
    async edit_manifest(user_cid,old_manifest_cid,op,proceed) {
        //
        let profile_path = `/copious.world/grand_${btype}_repository/profiles/${user_cid}`
        let manifest_path = `${profile_path}/manifest`
        //
        let file = await ipfs.files.stat(manifest_path)
        let manifest_entry = {
            "file" : file.name,
            "cid" : file.cid.toString(),   /// new cid
            "size" : file.size
        }
        //
        if ( manifest_entry ) {
            let no_error = true
            proceed = (proceed === undefined) ? false : proceed
            let m_cid = manifest_entry.cid
            if ( m_cid !== old_manifest_cid ) {
                no_error = false
                addError(new Error("Manifest has been replaced"))
            }
            //
            // proceed with the old manifest CID
            if ( proceed || no_error ) {
                let manifest_data = await this.get_complete_file_from_cid(old_manifest_cid)
                try {
                    //
                    let manifest_obj = JSON.parse(manifest_data)
                    if ( op ) {     ///  MANIFEST OPERATIONS
                        //
                        let store_op = Object.assign({},op)
                        store_op.when = Date.now()
                        manifest_obj.op_history.push(store_op)
                        //
                        let cfile_cid = op.cid // a contact form
                        let encrypted = op.encrypted
                        let preference = op.preference
                        switch ( op.cmd ) {
                            case 'add' : {
                                if ( (manifest_obj.max_preference <  preference) && (encrypted == false) ) {
                                    manifest_obj.default_contact_form = cfile_cid
                                    manifest_obj.max_preference = preference
                                }
                                let b = manifest_obj.custom_contact_forms.some((cfile) => {
                                    return ( cfile.cid === cfile_cid )
                                })
                                if ( b ) {
                                    insert_by_pref(manifest_obj.custom_contact_forms,{
                                    "file" : cfile_cid,
                                    "preference" : preference,
                                    "encrypted" : encrypted
                                    })
                                }
                                //
                                break;
                            }
                            case 'delete' : {
                                let contact_form_list = manifest_obj.custom_contact_forms.filter((cform) => {
                                    return(cform.cid !== cfile_cid)
                                })
                                manifest_obj.custom_contact_forms = contact_form_list // list without the form being discarded
                                // 
                                // try to find a clear text form to replace the default 
                                // if the default is being discarded. If there is not one, then don't replace.. Expect user to search for a better one.
                                if ( cfile_cid == manifest_obj.default_contact_form ) { 
                                    for ( let cform_entry of manifest_obj.custom_contact_forms ) {
                                        if ( cform_entry.encrypted === false ) {
                                            manifest_obj.default_contact_form = cform_entry.cid
                                            break;
                                        }
                                    }
                                }
                                break;
                            }
                            case 'update_default' : {   // only apply to the default. Preference is not read
                                manifest_obj.default_contact_form = cfile_cid
                                // if this does not exsist, then insert it...
                                let b = manifest_obj.custom_contact_forms.some((cfile) => {
                                    return ( cfile.cid === cfile_cid )
                                })
                                if ( !b ) {
                                    insert_by_pref(manifest_obj.custom_contact_forms,{
                                    "file" : cfile_cid,
                                    "preference" : preference,
                                    "encrypted" : encrypted
                                    })
                                }
                                break;
                            }
                        }
                    }
                    let manifest = JSON.stringify(manifest_obj)
                    let manifest_cid = await this.update_file_in_ipfs(manifest_path,manifest)
                    return(manifest_cid)
                    //
                } catch (e) {
                    console.dir(e)
                }
            }
            //
        }
        return false
    }

    */

    var ipfs_profiles = /*#__PURE__*/Object.freeze({
        __proto__: null,
        set_alert_error_handler: set_alert_error_handler,
        fetch_contacts: fetch_contacts,
        fetch_manifest: fetch_manifest,
        fetch_topicst: fetch_topicst,
        update_contacts_to_ipfs: update_contacts_to_ipfs,
        update_manifest_to_ipfs: update_manifest_to_ipfs,
        update_topics_to_ipfs: update_topics_to_ipfs,
        fetch_contact_page: fetch_contact_page,
        add_profile: add_profile,
        fetch_contact_cid: fetch_contact_cid,
        get_dir: get_dir,
        send_message: send_message,
        send_introduction: send_introduction,
        send_topic: send_topic,
        send_topic_offer: send_topic_offer,
        get_message_files: get_message_files,
        get_topic_files: get_topic_files,
        get_template_list: get_template_list,
        get_contact_template: get_contact_template,
        put_contact_template: put_contact_template
    });

    /* src/MessageEditor.svelte generated by Svelte v3.37.0 */
    const file$1 = "src/MessageEditor.svelte";

    // (151:1) {#if has_previous }
    function create_if_block$1(ctx) {
    	let span;
    	let t1;
    	let div;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Previous Message:";
    			t1 = space();
    			div = element("div");
    			attr_dev(span, "class", "large-text-label svelte-19fvcgl");
    			add_location(span, file$1, 151, 1, 3782);
    			attr_dev(div, "id", "blg-window-full-text-outgo");
    			attr_dev(div, "class", "full-display svelte-19fvcgl");
    			add_location(div, file$1, 152, 1, 3840);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			div.innerHTML = /*answer_message*/ ctx[4];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*answer_message*/ 16) div.innerHTML = /*answer_message*/ ctx[4];		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(151:1) {#if has_previous }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div5;
    	let div2;
    	let span0;
    	let t0;
    	let t1;
    	let span1;
    	let t3;
    	let div0;
    	let span2;
    	let t4;
    	let t5;
    	let t6;
    	let span3;
    	let t7;
    	let t8;
    	let t9;
    	let t10;
    	let t11;
    	let t12;
    	let div1;
    	let t13;
    	let t14;
    	let t15;
    	let t16;
    	let t17;
    	let t18;
    	let t19;
    	let t20;
    	let span4;
    	let t22;
    	let button0;
    	let t24;
    	let button1;
    	let t26;
    	let div3;
    	let t27;
    	let div4;
    	let t28;
    	let input;
    	let mounted;
    	let dispose;
    	let if_block = /*has_previous*/ ctx[9] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div2 = element("div");
    			span0 = element("span");
    			t0 = text(/*todays_date*/ ctx[5]);
    			t1 = space();
    			span1 = element("span");
    			span1.textContent = "Sending a message to:";
    			t3 = space();
    			div0 = element("div");
    			span2 = element("span");
    			t4 = text(/*name*/ ctx[1]);
    			t5 = text(",");
    			t6 = space();
    			span3 = element("span");
    			t7 = text("who ");
    			t8 = text(/*b_label*/ ctx[7]);
    			t9 = text(" and ");
    			t10 = text(/*know_of*/ ctx[8]);
    			t11 = text(".");
    			t12 = space();
    			div1 = element("div");
    			t13 = text(/*name*/ ctx[1]);
    			t14 = text(" comes from ");
    			t15 = text(/*place_of_origin*/ ctx[2]);
    			t16 = text(" and wants you to know that: \"");
    			t17 = text(/*cool_public_info*/ ctx[3]);
    			t18 = text("\"");
    			t19 = space();
    			if (if_block) if_block.c();
    			t20 = space();
    			span4 = element("span");
    			span4.textContent = "Compose message here:";
    			t22 = space();
    			button0 = element("button");
    			button0.textContent = "begin compositions";
    			t24 = space();
    			button1 = element("button");
    			button1.textContent = "begin introduction";
    			t26 = space();
    			div3 = element("div");
    			t27 = space();
    			div4 = element("div");
    			t28 = space();
    			input = element("input");
    			set_style(span0, "background-color", "yellowgreen");
    			attr_dev(span0, "class", "svelte-19fvcgl");
    			add_location(span0, file$1, 139, 2, 3370);
    			attr_dev(span1, "class", "message_indicator svelte-19fvcgl");
    			add_location(span1, file$1, 140, 2, 3437);
    			attr_dev(span2, "class", "name svelte-19fvcgl");
    			add_location(span2, file$1, 142, 3, 3509);
    			attr_dev(span3, "class", "about_name svelte-19fvcgl");
    			add_location(span3, file$1, 143, 3, 3546);
    			add_location(div0, file$1, 141, 2, 3500);
    			attr_dev(div1, "class", "cool-stuff svelte-19fvcgl");
    			add_location(div1, file$1, 145, 2, 3619);
    			set_style(div2, "padding", "6px");
    			add_location(div2, file$1, 138, 1, 3340);
    			attr_dev(span4, "class", "large-text-label svelte-19fvcgl");
    			add_location(span4, file$1, 156, 1, 3942);
    			attr_dev(button0, "class", "medium_button svelte-19fvcgl");
    			add_location(button0, file$1, 157, 1, 4005);
    			attr_dev(button1, "class", "medium_button svelte-19fvcgl");
    			add_location(button1, file$1, 158, 1, 4091);
    			attr_dev(div3, "id", "blg-window-full-text-outgo");
    			attr_dev(div3, "class", "full-display-bottom svelte-19fvcgl");
    			add_location(div3, file$1, 159, 1, 4180);
    			attr_dev(div4, "id", "blg-window-full-text-outgo-script");
    			attr_dev(div4, "class", "is-nothing svelte-19fvcgl");
    			add_location(div4, file$1, 162, 1, 4280);
    			attr_dev(input, "type", "hidden");
    			attr_dev(input, "id", "pub-key-outgo");
    			add_location(input, file$1, 163, 1, 4352);
    			attr_dev(div5, "class", "blg-el-wrapper-full svelte-19fvcgl");
    			add_location(div5, file$1, 137, 0, 3304);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div2);
    			append_dev(div2, span0);
    			append_dev(span0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, span1);
    			append_dev(div2, t3);
    			append_dev(div2, div0);
    			append_dev(div0, span2);
    			append_dev(span2, t4);
    			append_dev(span2, t5);
    			append_dev(div0, t6);
    			append_dev(div0, span3);
    			append_dev(span3, t7);
    			append_dev(span3, t8);
    			append_dev(span3, t9);
    			append_dev(span3, t10);
    			append_dev(span3, t11);
    			append_dev(div2, t12);
    			append_dev(div2, div1);
    			append_dev(div1, t13);
    			append_dev(div1, t14);
    			append_dev(div1, t15);
    			append_dev(div1, t16);
    			append_dev(div1, t17);
    			append_dev(div1, t18);
    			append_dev(div5, t19);
    			if (if_block) if_block.m(div5, null);
    			append_dev(div5, t20);
    			append_dev(div5, span4);
    			append_dev(div5, t22);
    			append_dev(div5, button0);
    			append_dev(div5, t24);
    			append_dev(div5, button1);
    			append_dev(div5, t26);
    			append_dev(div5, div3);
    			div3.innerHTML = /*contact_page*/ ctx[6];
    			append_dev(div5, t27);
    			append_dev(div5, div4);
    			append_dev(div5, t28);
    			append_dev(div5, input);
    			set_input_value(input, /*public_key*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*start_composing*/ ctx[11], false, false, false),
    					listen_dev(button1, "click", /*start_introduction*/ ctx[10], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[15])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*todays_date*/ 32) set_data_dev(t0, /*todays_date*/ ctx[5]);
    			if (dirty & /*name*/ 2) set_data_dev(t4, /*name*/ ctx[1]);
    			if (dirty & /*b_label*/ 128) set_data_dev(t8, /*b_label*/ ctx[7]);
    			if (dirty & /*know_of*/ 256) set_data_dev(t10, /*know_of*/ ctx[8]);
    			if (dirty & /*name*/ 2) set_data_dev(t13, /*name*/ ctx[1]);
    			if (dirty & /*place_of_origin*/ 4) set_data_dev(t15, /*place_of_origin*/ ctx[2]);
    			if (dirty & /*cool_public_info*/ 8) set_data_dev(t17, /*cool_public_info*/ ctx[3]);
    			if (/*has_previous*/ ctx[9]) if_block.p(ctx, dirty);
    			if (dirty & /*contact_page*/ 64) div3.innerHTML = /*contact_page*/ ctx[6];
    			if (dirty & /*public_key*/ 1) {
    				set_input_value(input, /*public_key*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function convert_date(secsdate) {
    	if (secsdate === "never") {
    		return "never";
    	} else {
    		let idate = parseInt(secsdate);
    		let dformatted = new Date(idate).toLocaleDateString("en-US");
    		return dformatted;
    	}
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("MessageEditor", slots, []);
    	let { name } = $$props;
    	let { DOB } = $$props;
    	let { place_of_origin } = $$props;
    	let { cool_public_info } = $$props;
    	let { business } = $$props;
    	let { public_key } = $$props;
    	let { answer_message } = $$props;
    	let { active_user } = $$props;
    	let message_type = "introduction";

    	let receiver_user_info = {
    		name,
    		DOB,
    		place_of_origin,
    		cool_public_info,
    		business,
    		public_key,
    		name
    	};

    	let r_cid = false;
    	let r_p_cid = false;

    	(async () => {
    		r_cid = await fetch_contact_cid(receiver_user_info, false); // established contact
    		r_p_cid = await fetch_contact_cid(receiver_user_info, true); // introduction or no privacy intended
    	})();

    	let todays_date = "";
    	let contact_page = "";
    	let b_label = "";
    	let know_of = "";
    	let has_previous = answer_message && typeof answer_message === "string" && answer_message.length;

    	async function start_introduction() {
    		//
    		let contact_page_descr = await fetch_contact_page("default", r_p_cid);

    		if (contact_page_descr) {
    			let html = contact_page_descr.html;
    			$$invalidate(6, contact_page = decodeURIComponent(html));
    			let script = contact_page_descr.script;
    			script = decodeURIComponent(script);
    			script = script.replace("{{when}}", Date.now());
    			addscript(script, "blg-window-full-text-outgo-script", true);
    		}
    	} //

    	async function start_composing() {
    		//
    		let contact_page_descr = await fetch_contact_page("cid", r_cid);

    		if (contact_page_descr) {
    			let html = contact_page_descr.html;
    			$$invalidate(6, contact_page = decodeURIComponent(html));
    			let script = contact_page_descr.script;
    			script = decodeURIComponent(script);
    			script = script.replace("{{when}}", Date.now());
    			addscript(script, "blg-window-full-text-outgo-script", true);
    		}
    	} //

    	// // // // // // 
    	//
    	async function ipfs_sender(message) {
    		switch (message_type) {
    			case "introduction":
    				{
    					let identify = active_user;

    					if (identify) {
    						let user_info = identify.user_info;
    						await send_introduction(receiver_user_info, user_info, message);
    					}

    					break;
    				}
    			default:
    				{
    					let identify = active_user;

    					if (identify) {
    						let user_info = identify.user_info;
    						await send_message(receiver_user_info, user_info, message);
    					}

    					break;
    				}
    		}
    	}

    	//
    	onMount(() => {
    		if (window._app_set_default_message_sender !== undefined) {
    			window._app_set_default_message_sender(ipfs_sender);
    		}
    	});

    	const writable_props = [
    		"name",
    		"DOB",
    		"place_of_origin",
    		"cool_public_info",
    		"business",
    		"public_key",
    		"answer_message",
    		"active_user"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MessageEditor> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		public_key = this.value;
    		$$invalidate(0, public_key);
    	}

    	$$self.$$set = $$props => {
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("DOB" in $$props) $$invalidate(12, DOB = $$props.DOB);
    		if ("place_of_origin" in $$props) $$invalidate(2, place_of_origin = $$props.place_of_origin);
    		if ("cool_public_info" in $$props) $$invalidate(3, cool_public_info = $$props.cool_public_info);
    		if ("business" in $$props) $$invalidate(13, business = $$props.business);
    		if ("public_key" in $$props) $$invalidate(0, public_key = $$props.public_key);
    		if ("answer_message" in $$props) $$invalidate(4, answer_message = $$props.answer_message);
    		if ("active_user" in $$props) $$invalidate(14, active_user = $$props.active_user);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		name,
    		DOB,
    		place_of_origin,
    		cool_public_info,
    		business,
    		public_key,
    		answer_message,
    		active_user,
    		ipfs_profiles,
    		message_type,
    		receiver_user_info,
    		r_cid,
    		r_p_cid,
    		todays_date,
    		contact_page,
    		b_label,
    		know_of,
    		has_previous,
    		convert_date,
    		start_introduction,
    		start_composing,
    		ipfs_sender
    	});

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("DOB" in $$props) $$invalidate(12, DOB = $$props.DOB);
    		if ("place_of_origin" in $$props) $$invalidate(2, place_of_origin = $$props.place_of_origin);
    		if ("cool_public_info" in $$props) $$invalidate(3, cool_public_info = $$props.cool_public_info);
    		if ("business" in $$props) $$invalidate(13, business = $$props.business);
    		if ("public_key" in $$props) $$invalidate(0, public_key = $$props.public_key);
    		if ("answer_message" in $$props) $$invalidate(4, answer_message = $$props.answer_message);
    		if ("active_user" in $$props) $$invalidate(14, active_user = $$props.active_user);
    		if ("message_type" in $$props) message_type = $$props.message_type;
    		if ("receiver_user_info" in $$props) receiver_user_info = $$props.receiver_user_info;
    		if ("r_cid" in $$props) r_cid = $$props.r_cid;
    		if ("r_p_cid" in $$props) r_p_cid = $$props.r_p_cid;
    		if ("todays_date" in $$props) $$invalidate(5, todays_date = $$props.todays_date);
    		if ("contact_page" in $$props) $$invalidate(6, contact_page = $$props.contact_page);
    		if ("b_label" in $$props) $$invalidate(7, b_label = $$props.b_label);
    		if ("know_of" in $$props) $$invalidate(8, know_of = $$props.know_of);
    		if ("has_previous" in $$props) $$invalidate(9, has_previous = $$props.has_previous);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*name, place_of_origin, cool_public_info, business, public_key*/ 8207) {
    			{
    				receiver_user_info = {
    					name,
    					"DOB": Date.now(),
    					place_of_origin,
    					cool_public_info,
    					business,
    					public_key
    				};
    			}
    		}

    		if ($$self.$$.dirty & /*business*/ 8192) {
    			$$invalidate(7, b_label = business ? " is a business" : " is a person");
    		}

    		if ($$self.$$.dirty & /*public_key*/ 1) {
    			$$invalidate(8, know_of = public_key !== false
    			? " is someone I know"
    			: " is a new introduction");
    		}
    	};

    	{
    		$$invalidate(5, todays_date = new Date().toISOString());
    	}

    	return [
    		public_key,
    		name,
    		place_of_origin,
    		cool_public_info,
    		answer_message,
    		todays_date,
    		contact_page,
    		b_label,
    		know_of,
    		has_previous,
    		start_introduction,
    		start_composing,
    		DOB,
    		business,
    		active_user,
    		input_input_handler
    	];
    }

    class MessageEditor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			name: 1,
    			DOB: 12,
    			place_of_origin: 2,
    			cool_public_info: 3,
    			business: 13,
    			public_key: 0,
    			answer_message: 4,
    			active_user: 14
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MessageEditor",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[1] === undefined && !("name" in props)) {
    			console.warn("<MessageEditor> was created without expected prop 'name'");
    		}

    		if (/*DOB*/ ctx[12] === undefined && !("DOB" in props)) {
    			console.warn("<MessageEditor> was created without expected prop 'DOB'");
    		}

    		if (/*place_of_origin*/ ctx[2] === undefined && !("place_of_origin" in props)) {
    			console.warn("<MessageEditor> was created without expected prop 'place_of_origin'");
    		}

    		if (/*cool_public_info*/ ctx[3] === undefined && !("cool_public_info" in props)) {
    			console.warn("<MessageEditor> was created without expected prop 'cool_public_info'");
    		}

    		if (/*business*/ ctx[13] === undefined && !("business" in props)) {
    			console.warn("<MessageEditor> was created without expected prop 'business'");
    		}

    		if (/*public_key*/ ctx[0] === undefined && !("public_key" in props)) {
    			console.warn("<MessageEditor> was created without expected prop 'public_key'");
    		}

    		if (/*answer_message*/ ctx[4] === undefined && !("answer_message" in props)) {
    			console.warn("<MessageEditor> was created without expected prop 'answer_message'");
    		}

    		if (/*active_user*/ ctx[14] === undefined && !("active_user" in props)) {
    			console.warn("<MessageEditor> was created without expected prop 'active_user'");
    		}
    	}

    	get name() {
    		throw new Error("<MessageEditor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<MessageEditor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get DOB() {
    		throw new Error("<MessageEditor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set DOB(value) {
    		throw new Error("<MessageEditor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get place_of_origin() {
    		throw new Error("<MessageEditor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set place_of_origin(value) {
    		throw new Error("<MessageEditor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cool_public_info() {
    		throw new Error("<MessageEditor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cool_public_info(value) {
    		throw new Error("<MessageEditor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get business() {
    		throw new Error("<MessageEditor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set business(value) {
    		throw new Error("<MessageEditor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get public_key() {
    		throw new Error("<MessageEditor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set public_key(value) {
    		throw new Error("<MessageEditor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get answer_message() {
    		throw new Error("<MessageEditor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set answer_message(value) {
    		throw new Error("<MessageEditor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active_user() {
    		throw new Error("<MessageEditor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active_user(value) {
    		throw new Error("<MessageEditor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.37.0 */

    const { console: console_1 } = globals;
    const file = "src/App.svelte";

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[106] = list[i];
    	child_ctx[14] = i;
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[104] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[101] = list[i];
    	child_ctx[47] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[101] = list[i];
    	child_ctx[46] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[99] = list[i];
    	child_ctx[12] = i;
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[97] = list[i];
    	child_ctx[13] = i;
    	return child_ctx;
    }

    // (864:2) <Label>
    function create_default_slot_4(ctx) {
    	let span;
    	let t_value = /*tab*/ ctx[108] + "";
    	let t;
    	let span_class_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);

    			attr_dev(span, "class", span_class_value = "" + (null_to_empty(/*tab*/ ctx[108] === /*active*/ ctx[28]
    			? "active-tab"
    			: "plain-tab") + " svelte-1g8gjzi"));

    			add_location(span, file, 863, 9, 21221);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[3] & /*tab*/ 32768 && t_value !== (t_value = /*tab*/ ctx[108] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*active*/ 268435456 | dirty[3] & /*tab*/ 32768 && span_class_value !== (span_class_value = "" + (null_to_empty(/*tab*/ ctx[108] === /*active*/ ctx[28]
    			? "active-tab"
    			: "plain-tab") + " svelte-1g8gjzi"))) {
    				attr_dev(span, "class", span_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(864:2) <Label>",
    		ctx
    	});

    	return block;
    }

    // (863:3) <Tab {tab}>
    function create_default_slot_3(ctx) {
    	let label;
    	let current;

    	label = new CommonLabel({
    			props: {
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const label_changes = {};

    			if (dirty[0] & /*active*/ 268435456 | dirty[3] & /*$$scope, tab*/ 98304) {
    				label_changes.$$scope = { dirty, ctx };
    			}

    			label.$set(label_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(863:3) <Tab {tab}>",
    		ctx
    	});

    	return block;
    }

    // (861:1) <TabBar tabs={['Identify', 'User', 'Messages', 'Introductions', 'Contacts', 'Manifest', 'About Us']} let:tab bind:active>
    function create_default_slot_2(ctx) {
    	let tab;
    	let current;

    	tab = new Tab({
    			props: {
    				tab: /*tab*/ ctx[108],
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tab.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tab, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tab_changes = {};
    			if (dirty[3] & /*tab*/ 32768) tab_changes.tab = /*tab*/ ctx[108];

    			if (dirty[0] & /*active*/ 268435456 | dirty[3] & /*$$scope, tab*/ 98304) {
    				tab_changes.$$scope = { dirty, ctx };
    			}

    			tab.$set(tab_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tab, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(861:1) <TabBar tabs={['Identify', 'User', 'Messages', 'Introductions', 'Contacts', 'Manifest', 'About Us']} let:tab bind:active>",
    		ctx
    	});

    	return block;
    }

    // (1139:36) 
    function create_if_block_12(ctx) {
    	let div;
    	let blockquote0;
    	let t1;
    	let blockquote1;
    	let t3;
    	let blockquote2;
    	let t5;
    	let blockquote3;
    	let t7;
    	let blockquote4;
    	let span;
    	let t9;
    	let t10;
    	let blockquote5;
    	let t12;
    	let blockquote6;
    	let t14;
    	let blockquote7;
    	let t16;
    	let blockquote8;
    	let t18;
    	let blockquote9;

    	const block = {
    		c: function create() {
    			div = element("div");
    			blockquote0 = element("blockquote");
    			blockquote0.textContent = "This service is free. It is a way for you to set up messaging with other people.\n\t\tIt is like email, but it offers an alernative ways of running your message process.";
    			t1 = space();
    			blockquote1 = element("blockquote");
    			blockquote1.textContent = "For one, there is no email service associated with this way of handling messages. \n\t\tAll messages and interfaces for interacting with the processes are stored on the Inner Planetary File System.";
    			t3 = space();
    			blockquote2 = element("blockquote");
    			blockquote2.textContent = "Your contact pages is stored there. This tool makes the contact page and stores it for you. Then when someone wants to send \n\t\tyou a message, they access your contact page. The person who sends you a message will write a message on your page and click send.\n\t\tThe contact page you use will send a message service that is baked into the contact page.";
    			t5 = space();
    			blockquote3 = element("blockquote");
    			blockquote3.textContent = "This tool, makes and stores the kind of contact page you want to store. So, by selecting the type of contact page, you will also be selecting \n\t\thow you want to communicate. You also get to select your style of contact page. Maybe you want to have your picture on it, maybe not.\n\t\tDepending on the community of contact page makers, you may find different styles. Each style is part of a template. And, you select the template.";
    			t7 = space();
    			blockquote4 = element("blockquote");
    			span = element("span");
    			span.textContent = "How to get the word out about your page?";
    			t9 = text(" You are probably used to handing out a business card with your email on it.\n\t\tBut, instead of that, you can hand out the link to your contact page. The actual link that you receive when you sign up might be hard to read. \n\t\tBut, you can give out the contents of the fields that you entered in order to make your contact page.");
    			t10 = space();
    			blockquote5 = element("blockquote");
    			blockquote5.textContent = "The reason we have asked for information you might tell anyone is that we are asking for information you want to share. This information should identify you,\n\t\tbut not give away secrets. When someone sends a message, we can find your contact page by reprocessing the same information.";
    			t12 = space();
    			blockquote6 = element("blockquote");
    			blockquote6.textContent = "If you don't want to print you contact information on your business card, you can always just give out the hash code.\n\t\tBut, keep in mind, your contacts will have to type it.";
    			t14 = space();
    			blockquote7 = element("blockquote");
    			blockquote7.textContent = "Now, you can store contact information in your list of contacts. Each of these links will find the contact page.";
    			t16 = space();
    			blockquote8 = element("blockquote");
    			blockquote8.textContent = "Now about getting unsoliceted mail or blog feeds from organizations. For these you get a separate number. Messages being sent through a messaging service will use\n\t\tan API link to send messages to the agreed upon topic (the topic you tell the organization that they can bug you about.) You can use your topic dashbaord to \n\t\tselect the latest news from organization you care about.";
    			t18 = space();
    			blockquote9 = element("blockquote");
    			blockquote9.textContent = "Messages from contacts will show up in your mail stream (promail). Find links to that on your management dashboard (also generated by when you sign up.)\n\t\tTo help you find your information when you go back to your browser, the information you enter on signing up will be stored in your broswer's database (indexedDb).\n\t\tIf you switch browsers, you can always enter your information again, and click \"restore\". You will also find an option to remove your information from your browser.";
    			attr_dev(blockquote0, "class", "svelte-1g8gjzi");
    			add_location(blockquote0, file, 1140, 2, 32877);
    			attr_dev(blockquote1, "class", "svelte-1g8gjzi");
    			add_location(blockquote1, file, 1144, 2, 33077);
    			attr_dev(blockquote2, "class", "svelte-1g8gjzi");
    			add_location(blockquote2, file, 1148, 2, 33305);
    			attr_dev(blockquote3, "class", "svelte-1g8gjzi");
    			add_location(blockquote3, file, 1153, 2, 33688);
    			set_style(span, "font-weight", "bold");
    			attr_dev(span, "class", "svelte-1g8gjzi");
    			add_location(span, file, 1159, 2, 34163);
    			attr_dev(blockquote4, "class", "svelte-1g8gjzi");
    			add_location(blockquote4, file, 1158, 2, 34148);
    			attr_dev(blockquote5, "class", "svelte-1g8gjzi");
    			add_location(blockquote5, file, 1163, 2, 34589);
    			attr_dev(blockquote6, "class", "svelte-1g8gjzi");
    			add_location(blockquote6, file, 1167, 2, 34907);
    			attr_dev(blockquote7, "class", "svelte-1g8gjzi");
    			add_location(blockquote7, file, 1171, 2, 35115);
    			attr_dev(blockquote8, "class", "svelte-1g8gjzi");
    			add_location(blockquote8, file, 1174, 2, 35261);
    			attr_dev(blockquote9, "class", "svelte-1g8gjzi");
    			add_location(blockquote9, file, 1179, 2, 35677);
    			attr_dev(div, "class", "team_message svelte-1g8gjzi");
    			add_location(div, file, 1139, 1, 32846);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, blockquote0);
    			append_dev(div, t1);
    			append_dev(div, blockquote1);
    			append_dev(div, t3);
    			append_dev(div, blockquote2);
    			append_dev(div, t5);
    			append_dev(div, blockquote3);
    			append_dev(div, t7);
    			append_dev(div, blockquote4);
    			append_dev(blockquote4, span);
    			append_dev(blockquote4, t9);
    			append_dev(div, t10);
    			append_dev(div, blockquote5);
    			append_dev(div, t12);
    			append_dev(div, blockquote6);
    			append_dev(div, t14);
    			append_dev(div, blockquote7);
    			append_dev(div, t16);
    			append_dev(div, blockquote8);
    			append_dev(div, t18);
    			append_dev(div, blockquote9);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(1139:36) ",
    		ctx
    	});

    	return block;
    }

    // (1099:36) 
    function create_if_block_11(ctx) {
    	let div7;
    	let blockquote;
    	let t1;
    	let div6;
    	let div4;
    	let div3;
    	let div2;
    	let input0;
    	let t2;
    	let select;
    	let t3;
    	let div0;
    	let button0;
    	let t4;
    	let button0_disabled_value;
    	let t5;
    	let button1;
    	let t6;
    	let button1_disabled_value;
    	let t7;
    	let button2;
    	let t8;
    	let button2_disabled_value;
    	let t9;
    	let div1;
    	let label0;
    	let t11;
    	let input1;
    	let t12;
    	let label1;
    	let t14;
    	let input2;
    	let t15;
    	let label2;
    	let t17;
    	let input3;
    	let t18;
    	let div5;
    	let mounted;
    	let dispose;
    	let each_value_5 = /*filtered_manifest_contact_form_list*/ ctx[10];
    	validate_each_argument(each_value_5);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
    	}

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			blockquote = element("blockquote");
    			blockquote.textContent = "The manifest is your list of custom contact forms. \n\t\t\tWhen you send a message to someone, you may send them a link to one of your contact forms that will best handle \n\t\t\tthe way that your contact might respond to you. Use the tools here to manage your collection of contact forms.";
    			t1 = space();
    			div6 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			input0 = element("input");
    			t2 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			div0 = element("div");
    			button0 = element("button");
    			t4 = text("add");
    			t5 = space();
    			button1 = element("button");
    			t6 = text("update");
    			t7 = space();
    			button2 = element("button");
    			t8 = text("delete");
    			t9 = space();
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name:";
    			t11 = space();
    			input1 = element("input");
    			t12 = text("\n\t\t\t\t\t\t\t//\n\t\t\t\t\t\t\t");
    			label1 = element("label");
    			label1.textContent = "Preference Level:";
    			t14 = space();
    			input2 = element("input");
    			t15 = space();
    			label2 = element("label");
    			label2.textContent = "Manifest IPFS Link:";
    			t17 = space();
    			input3 = element("input");
    			t18 = space();
    			div5 = element("div");
    			attr_dev(blockquote, "class", "svelte-1g8gjzi");
    			add_location(blockquote, file, 1100, 2, 31052);
    			attr_dev(input0, "placeholder", "filter prefix");
    			attr_dev(input0, "class", "svelte-1g8gjzi");
    			add_location(input0, file, 1109, 6, 31490);
    			attr_dev(select, "size", 5);
    			attr_dev(select, "class", "svelte-1g8gjzi");
    			if (/*manifest_index*/ ctx[14] === void 0) add_render_callback(() => /*select_change_handler_3*/ ctx[72].call(select));
    			add_location(select, file, 1110, 6, 31556);
    			button0.disabled = button0_disabled_value = !/*man_title*/ ctx[27];
    			attr_dev(button0, "class", "svelte-1g8gjzi");
    			add_location(button0, file, 1116, 7, 31819);
    			button1.disabled = button1_disabled_value = !/*man_title*/ ctx[27] || !/*manifest_selected_entry*/ ctx[5];
    			attr_dev(button1, "class", "svelte-1g8gjzi");
    			add_location(button1, file, 1117, 7, 31903);
    			button2.disabled = button2_disabled_value = !/*manifest_selected_entry*/ ctx[5];
    			attr_dev(button2, "class", "svelte-1g8gjzi");
    			add_location(button2, file, 1118, 7, 32021);
    			attr_dev(div0, "class", "buttons svelte-1g8gjzi");
    			add_location(div0, file, 1115, 6, 31790);
    			attr_dev(label0, "for", "name");
    			set_style(label0, "display", "inline");
    			attr_dev(label0, "class", "svelte-1g8gjzi");
    			add_location(label0, file, 1121, 7, 32169);
    			attr_dev(input1, "id", "name");
    			attr_dev(input1, "placeholder", "Name");
    			set_style(input1, "display", "inline");
    			attr_dev(input1, "class", "svelte-1g8gjzi");
    			add_location(input1, file, 1122, 7, 32232);
    			attr_dev(label1, "for", "name");
    			set_style(label1, "display", "inline");
    			attr_dev(label1, "class", "svelte-1g8gjzi");
    			add_location(label1, file, 1124, 7, 32332);
    			attr_dev(input2, "id", "name");
    			attr_dev(input2, "placeholder", "Name");
    			set_style(input2, "display", "inline");
    			attr_dev(input2, "class", "svelte-1g8gjzi");
    			add_location(input2, file, 1125, 7, 32407);
    			attr_dev(label2, "for", "name");
    			set_style(label2, "display", "inline");
    			attr_dev(label2, "class", "svelte-1g8gjzi");
    			add_location(label2, file, 1127, 7, 32514);
    			attr_dev(input3, "id", "name");
    			attr_dev(input3, "placeholder", "Name");
    			set_style(input3, "display", "inline");
    			attr_dev(input3, "class", "svelte-1g8gjzi");
    			add_location(input3, file, 1128, 7, 32591);
    			attr_dev(div1, "class", "inner_div svelte-1g8gjzi");
    			add_location(div1, file, 1120, 6, 32137);
    			attr_dev(div2, "class", "item svelte-1g8gjzi");
    			add_location(div2, file, 1108, 5, 31464);
    			attr_dev(div3, "class", "items svelte-1g8gjzi");
    			add_location(div3, file, 1107, 4, 31439);
    			attr_dev(div4, "class", "manifester svelte-1g8gjzi");
    			add_location(div4, file, 1106, 3, 31410);
    			attr_dev(div5, "class", "manifester svelte-1g8gjzi");
    			add_location(div5, file, 1133, 3, 32721);
    			attr_dev(div6, "class", "manifest-grid-container svelte-1g8gjzi");
    			add_location(div6, file, 1105, 2, 31368);
    			attr_dev(div7, "class", "svelte-1g8gjzi");
    			add_location(div7, file, 1099, 1, 31044);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, blockquote);
    			append_dev(div7, t1);
    			append_dev(div7, div6);
    			append_dev(div6, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, input0);
    			set_input_value(input0, /*man_prefix*/ ctx[1]);
    			append_dev(div2, t2);
    			append_dev(div2, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*manifest_index*/ ctx[14]);
    			append_dev(div2, t3);
    			append_dev(div2, div0);
    			append_dev(div0, button0);
    			append_dev(button0, t4);
    			append_dev(div0, t5);
    			append_dev(div0, button1);
    			append_dev(button1, t6);
    			append_dev(div0, t7);
    			append_dev(div0, button2);
    			append_dev(button2, t8);
    			append_dev(div2, t9);
    			append_dev(div2, div1);
    			append_dev(div1, label0);
    			append_dev(div1, t11);
    			append_dev(div1, input1);
    			set_input_value(input1, /*man_title*/ ctx[27]);
    			append_dev(div1, t12);
    			append_dev(div1, label1);
    			append_dev(div1, t14);
    			append_dev(div1, input2);
    			set_input_value(input2, /*man_max_preference*/ ctx[7]);
    			append_dev(div1, t15);
    			append_dev(div1, label2);
    			append_dev(div1, t17);
    			append_dev(div1, input3);
    			set_input_value(input3, /*man_cid*/ ctx[6]);
    			append_dev(div6, t18);
    			append_dev(div6, div5);
    			div5.innerHTML = /*manifest_selected_form*/ ctx[26];

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_2*/ ctx[71]),
    					listen_dev(select, "change", /*select_change_handler_3*/ ctx[72]),
    					listen_dev(button0, "click", /*man_add_contact_form*/ ctx[43], false, false, false),
    					listen_dev(button1, "click", /*man_update_contact_form*/ ctx[44], false, false, false),
    					listen_dev(button2, "click", /*man_remove_contact_form*/ ctx[45], false, false, false),
    					listen_dev(input1, "input", /*input1_input_handler_1*/ ctx[73]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[74]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[75])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*man_prefix*/ 2 && input0.value !== /*man_prefix*/ ctx[1]) {
    				set_input_value(input0, /*man_prefix*/ ctx[1]);
    			}

    			if (dirty[0] & /*filtered_manifest_contact_form_list*/ 1024) {
    				each_value_5 = /*filtered_manifest_contact_form_list*/ ctx[10];
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5(ctx, each_value_5, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_5.length;
    			}

    			if (dirty[0] & /*manifest_index*/ 16384) {
    				select_option(select, /*manifest_index*/ ctx[14]);
    			}

    			if (dirty[0] & /*man_title*/ 134217728 && button0_disabled_value !== (button0_disabled_value = !/*man_title*/ ctx[27])) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (dirty[0] & /*man_title, manifest_selected_entry*/ 134217760 && button1_disabled_value !== (button1_disabled_value = !/*man_title*/ ctx[27] || !/*manifest_selected_entry*/ ctx[5])) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}

    			if (dirty[0] & /*manifest_selected_entry*/ 32 && button2_disabled_value !== (button2_disabled_value = !/*manifest_selected_entry*/ ctx[5])) {
    				prop_dev(button2, "disabled", button2_disabled_value);
    			}

    			if (dirty[0] & /*man_title*/ 134217728 && input1.value !== /*man_title*/ ctx[27]) {
    				set_input_value(input1, /*man_title*/ ctx[27]);
    			}

    			if (dirty[0] & /*man_max_preference*/ 128 && input2.value !== /*man_max_preference*/ ctx[7]) {
    				set_input_value(input2, /*man_max_preference*/ ctx[7]);
    			}

    			if (dirty[0] & /*man_cid*/ 64 && input3.value !== /*man_cid*/ ctx[6]) {
    				set_input_value(input3, /*man_cid*/ ctx[6]);
    			}

    			if (dirty[0] & /*manifest_selected_form*/ 67108864) div5.innerHTML = /*manifest_selected_form*/ ctx[26];		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(1099:36) ",
    		ctx
    	});

    	return block;
    }

    // (1047:35) 
    function create_if_block_7(ctx) {
    	let div8;
    	let div1;
    	let input0;
    	let t0;
    	let select;
    	let t1;
    	let div0;
    	let button0;
    	let t2;
    	let button0_disabled_value;
    	let t3;
    	let button1;
    	let t4;
    	let button1_disabled_value;
    	let t5;
    	let button2;
    	let t6;
    	let button2_disabled_value;
    	let t7;
    	let div6;
    	let br0;
    	let t8;
    	let div2;
    	let label0;
    	let t10;
    	let input1;
    	let t11;
    	let input2;
    	let t12;
    	let t13;
    	let div3;
    	let t14;
    	let div4;
    	let t15;
    	let div5;
    	let label1;
    	let br1;
    	let t17;
    	let textarea;
    	let t18;
    	let div7;
    	let span;
    	let t20;
    	let t21;
    	let t22;
    	let br2;
    	let br3;
    	let t23;
    	let button3;
    	let mounted;
    	let dispose;
    	let each_value_4 = /*filteredIndviduals*/ ctx[9];
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	function select_block_type_4(ctx, dirty) {
    		if (/*c_business*/ ctx[24]) return create_if_block_10;
    		return create_else_block_5;
    	}

    	let current_block_type = select_block_type_4(ctx);
    	let if_block0 = current_block_type(ctx);

    	function select_block_type_5(ctx, dirty) {
    		if (/*c_business*/ ctx[24]) return create_if_block_9;
    		return create_else_block_4;
    	}

    	let current_block_type_1 = select_block_type_5(ctx);
    	let if_block1 = current_block_type_1(ctx);

    	function select_block_type_6(ctx, dirty) {
    		if (/*c_business*/ ctx[24]) return create_if_block_8;
    		return create_else_block_3;
    	}

    	let current_block_type_2 = select_block_type_6(ctx);
    	let if_block2 = current_block_type_2(ctx);

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div1 = element("div");
    			input0 = element("input");
    			t0 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			div0 = element("div");
    			button0 = element("button");
    			t2 = text("add");
    			t3 = space();
    			button1 = element("button");
    			t4 = text("update");
    			t5 = space();
    			button2 = element("button");
    			t6 = text("delete");
    			t7 = space();
    			div6 = element("div");
    			br0 = element("br");
    			t8 = space();
    			div2 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name:";
    			t10 = space();
    			input1 = element("input");
    			t11 = space();
    			input2 = element("input");
    			t12 = space();
    			if_block0.c();
    			t13 = space();
    			div3 = element("div");
    			if_block1.c();
    			t14 = space();
    			div4 = element("div");
    			if_block2.c();
    			t15 = space();
    			div5 = element("div");
    			label1 = element("label");
    			label1.textContent = "Cool Public Info";
    			br1 = element("br");
    			t17 = space();
    			textarea = element("textarea");
    			t18 = space();
    			div7 = element("div");
    			span = element("span");
    			span.textContent = "Compose a new message for:";
    			t20 = space();
    			t21 = text(/*c_name*/ ctx[20]);
    			t22 = space();
    			br2 = element("br");
    			br3 = element("br");
    			t23 = space();
    			button3 = element("button");
    			button3.textContent = "compose";
    			attr_dev(input0, "placeholder", "filter prefix");
    			attr_dev(input0, "class", "svelte-1g8gjzi");
    			add_location(input0, file, 1049, 3, 28803);
    			attr_dev(select, "size", 5);
    			attr_dev(select, "class", "svelte-1g8gjzi");
    			if (/*i*/ ctx[11] === void 0) add_render_callback(() => /*select_change_handler_2*/ ctx[63].call(select));
    			add_location(select, file, 1050, 3, 28862);
    			button0.disabled = button0_disabled_value = !/*c_name*/ ctx[20];
    			attr_dev(button0, "class", "svelte-1g8gjzi");
    			add_location(button0, file, 1056, 4, 29047);
    			button1.disabled = button1_disabled_value = !/*c_name*/ ctx[20] || !/*selected*/ ctx[8];
    			attr_dev(button1, "class", "svelte-1g8gjzi");
    			add_location(button1, file, 1057, 4, 29116);
    			button2.disabled = button2_disabled_value = !/*selected*/ ctx[8];
    			attr_dev(button2, "class", "svelte-1g8gjzi");
    			add_location(button2, file, 1058, 4, 29204);
    			attr_dev(div0, "class", "buttons svelte-1g8gjzi");
    			add_location(div0, file, 1055, 3, 29021);
    			attr_dev(div1, "class", "item svelte-1g8gjzi");
    			add_location(div1, file, 1048, 2, 28780);
    			attr_dev(br0, "class", "svelte-1g8gjzi");
    			add_location(br0, file, 1062, 3, 29364);
    			attr_dev(label0, "for", "name");
    			set_style(label0, "display", "inline");
    			attr_dev(label0, "class", "svelte-1g8gjzi");
    			add_location(label0, file, 1064, 4, 29401);
    			attr_dev(input1, "id", "name");
    			attr_dev(input1, "placeholder", "Name");
    			set_style(input1, "display", "inline");
    			attr_dev(input1, "class", "svelte-1g8gjzi");
    			add_location(input1, file, 1065, 4, 29461);
    			attr_dev(input2, "type", "checkbox");
    			set_style(input2, "display", "inline");
    			attr_dev(input2, "class", "svelte-1g8gjzi");
    			add_location(input2, file, 1066, 4, 29545);
    			attr_dev(div2, "class", "inner_div svelte-1g8gjzi");
    			add_location(div2, file, 1063, 3, 29372);
    			attr_dev(div3, "class", "inner_div svelte-1g8gjzi");
    			add_location(div3, file, 1073, 3, 29728);
    			attr_dev(div4, "class", "inner_div svelte-1g8gjzi");
    			add_location(div4, file, 1080, 3, 30122);
    			attr_dev(label1, "for", "self-text");
    			attr_dev(label1, "class", "svelte-1g8gjzi");
    			add_location(label1, file, 1088, 3, 30571);
    			attr_dev(br1, "class", "svelte-1g8gjzi");
    			add_location(br1, file, 1088, 50, 30618);
    			attr_dev(textarea, "id", "self-text");
    			attr_dev(textarea, "placeholder", "Copy info given to you by your new contact");
    			attr_dev(textarea, "class", "svelte-1g8gjzi");
    			add_location(textarea, file, 1089, 3, 30626);
    			attr_dev(div5, "class", "inner_div svelte-1g8gjzi");
    			add_location(div5, file, 1087, 3, 30543);
    			attr_dev(div6, "class", "item svelte-1g8gjzi");
    			set_style(div6, "border-top", "darkslategrey solid 2px");
    			add_location(div6, file, 1061, 2, 29298);
    			attr_dev(span, "class", "top_instructions svelte-1g8gjzi");
    			add_location(span, file, 1093, 3, 30832);
    			attr_dev(br2, "class", "svelte-1g8gjzi");
    			add_location(br2, file, 1094, 3, 30910);
    			attr_dev(br3, "class", "svelte-1g8gjzi");
    			add_location(br3, file, 1094, 7, 30914);
    			attr_dev(button3, "class", "long_button svelte-1g8gjzi");
    			add_location(button3, file, 1095, 3, 30922);
    			attr_dev(div7, "class", "item svelte-1g8gjzi");
    			set_style(div7, "border-top", "darkslategrey solid 2px");
    			add_location(div7, file, 1092, 2, 30764);
    			attr_dev(div8, "class", "items svelte-1g8gjzi");
    			add_location(div8, file, 1047, 1, 28758);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div1);
    			append_dev(div1, input0);
    			set_input_value(input0, /*prefix*/ ctx[0]);
    			append_dev(div1, t0);
    			append_dev(div1, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*i*/ ctx[11]);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(button0, t2);
    			append_dev(div0, t3);
    			append_dev(div0, button1);
    			append_dev(button1, t4);
    			append_dev(div0, t5);
    			append_dev(div0, button2);
    			append_dev(button2, t6);
    			append_dev(div8, t7);
    			append_dev(div8, div6);
    			append_dev(div6, br0);
    			append_dev(div6, t8);
    			append_dev(div6, div2);
    			append_dev(div2, label0);
    			append_dev(div2, t10);
    			append_dev(div2, input1);
    			set_input_value(input1, /*c_name*/ ctx[20]);
    			append_dev(div2, t11);
    			append_dev(div2, input2);
    			input2.checked = /*c_business*/ ctx[24];
    			append_dev(div2, t12);
    			if_block0.m(div2, null);
    			append_dev(div6, t13);
    			append_dev(div6, div3);
    			if_block1.m(div3, null);
    			append_dev(div6, t14);
    			append_dev(div6, div4);
    			if_block2.m(div4, null);
    			append_dev(div6, t15);
    			append_dev(div6, div5);
    			append_dev(div5, label1);
    			append_dev(div5, br1);
    			append_dev(div5, t17);
    			append_dev(div5, textarea);
    			set_input_value(textarea, /*c_cool_public_info*/ ctx[23]);
    			append_dev(div8, t18);
    			append_dev(div8, div7);
    			append_dev(div7, span);
    			append_dev(div7, t20);
    			append_dev(div7, t21);
    			append_dev(div7, t22);
    			append_dev(div7, br2);
    			append_dev(div7, br3);
    			append_dev(div7, t23);
    			append_dev(div7, button3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_1*/ ctx[62]),
    					listen_dev(select, "change", /*select_change_handler_2*/ ctx[63]),
    					listen_dev(button0, "click", /*add_contact*/ ctx[40], false, false, false),
    					listen_dev(button1, "click", /*update_contact*/ ctx[41], false, false, false),
    					listen_dev(button2, "click", /*remove_contact*/ ctx[42], false, false, false),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[64]),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[65]),
    					listen_dev(textarea, "input", /*textarea_input_handler_1*/ ctx[70]),
    					listen_dev(button3, "click", pop_editor, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*prefix*/ 1 && input0.value !== /*prefix*/ ctx[0]) {
    				set_input_value(input0, /*prefix*/ ctx[0]);
    			}

    			if (dirty[0] & /*filteredIndviduals*/ 512) {
    				each_value_4 = /*filteredIndviduals*/ ctx[9];
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_4.length;
    			}

    			if (dirty[0] & /*i*/ 2048) {
    				select_option(select, /*i*/ ctx[11]);
    			}

    			if (dirty[0] & /*c_name*/ 1048576 && button0_disabled_value !== (button0_disabled_value = !/*c_name*/ ctx[20])) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (dirty[0] & /*c_name, selected*/ 1048832 && button1_disabled_value !== (button1_disabled_value = !/*c_name*/ ctx[20] || !/*selected*/ ctx[8])) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}

    			if (dirty[0] & /*selected*/ 256 && button2_disabled_value !== (button2_disabled_value = !/*selected*/ ctx[8])) {
    				prop_dev(button2, "disabled", button2_disabled_value);
    			}

    			if (dirty[0] & /*c_name*/ 1048576 && input1.value !== /*c_name*/ ctx[20]) {
    				set_input_value(input1, /*c_name*/ ctx[20]);
    			}

    			if (dirty[0] & /*c_business*/ 16777216) {
    				input2.checked = /*c_business*/ ctx[24];
    			}

    			if (current_block_type !== (current_block_type = select_block_type_4(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div2, null);
    				}
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_5(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div3, null);
    				}
    			}

    			if (current_block_type_2 === (current_block_type_2 = select_block_type_6(ctx)) && if_block2) {
    				if_block2.p(ctx, dirty);
    			} else {
    				if_block2.d(1);
    				if_block2 = current_block_type_2(ctx);

    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(div4, null);
    				}
    			}

    			if (dirty[0] & /*c_cool_public_info*/ 8388608) {
    				set_input_value(textarea, /*c_cool_public_info*/ ctx[23]);
    			}

    			if (dirty[0] & /*c_name*/ 1048576) set_data_dev(t21, /*c_name*/ ctx[20]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    			destroy_each(each_blocks, detaching);
    			if_block0.d();
    			if_block1.d();
    			if_block2.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(1047:35) ",
    		ctx
    	});

    	return block;
    }

    // (1027:39) 
    function create_if_block_6(ctx) {
    	let div0;
    	let t1;
    	let div2;
    	let div1;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let th1;
    	let th2;
    	let t5;
    	let each_value_3 = /*inbound_solicitation_messages*/ ctx[30];
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "Introduction Messages";
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Date";
    			th1 = element("th");
    			th1.textContent = "Sender";
    			th2 = element("th");
    			th2.textContent = "Subject";
    			t5 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "svelte-1g8gjzi");
    			add_location(div0, file, 1027, 2, 28004);
    			set_style(th0, "width", "20%");
    			attr_dev(th0, "class", "svelte-1g8gjzi");
    			add_location(th0, file, 1033, 7, 28138);
    			set_style(th1, "width", "30%");
    			attr_dev(th1, "class", "svelte-1g8gjzi");
    			add_location(th1, file, 1033, 38, 28169);
    			set_style(th2, "width", "60%");
    			set_style(th2, "text-align", "left");
    			attr_dev(th2, "class", "svelte-1g8gjzi");
    			add_location(th2, file, 1033, 71, 28202);
    			attr_dev(tr, "class", "svelte-1g8gjzi");
    			add_location(tr, file, 1032, 6, 28126);
    			attr_dev(thead, "class", "svelte-1g8gjzi");
    			add_location(thead, file, 1031, 5, 28112);
    			set_style(table, "width", "100%");
    			attr_dev(table, "class", "svelte-1g8gjzi");
    			add_location(table, file, 1030, 4, 28080);
    			attr_dev(div1, "class", "tableFixHead svelte-1g8gjzi");
    			add_location(div1, file, 1029, 3, 28048);
    			attr_dev(div2, "class", "svelte-1g8gjzi");
    			add_location(div2, file, 1028, 2, 28039);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, th1);
    			append_dev(tr, th2);
    			append_dev(table, t5);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*inbound_solicitation_messages*/ 1073741824 | dirty[1] & /*full_message*/ 256) {
    				each_value_3 = /*inbound_solicitation_messages*/ ctx[30];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(1027:39) ",
    		ctx
    	});

    	return block;
    }

    // (1007:35) 
    function create_if_block_5(ctx) {
    	let div0;
    	let t1;
    	let div2;
    	let div1;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let th1;
    	let th2;
    	let t5;
    	let each_value_2 = /*inbound_contact_messages*/ ctx[31];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "Your Message History";
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Date";
    			th1 = element("th");
    			th1.textContent = "Sender";
    			th2 = element("th");
    			th2.textContent = "Subject";
    			t5 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "svelte-1g8gjzi");
    			add_location(div0, file, 1007, 2, 27249);
    			set_style(th0, "width", "20%");
    			attr_dev(th0, "class", "svelte-1g8gjzi");
    			add_location(th0, file, 1013, 7, 27382);
    			set_style(th1, "width", "30%");
    			attr_dev(th1, "class", "svelte-1g8gjzi");
    			add_location(th1, file, 1013, 38, 27413);
    			set_style(th2, "width", "60%");
    			set_style(th2, "text-align", "left");
    			attr_dev(th2, "class", "svelte-1g8gjzi");
    			add_location(th2, file, 1013, 71, 27446);
    			attr_dev(tr, "class", "svelte-1g8gjzi");
    			add_location(tr, file, 1012, 6, 27370);
    			attr_dev(thead, "class", "svelte-1g8gjzi");
    			add_location(thead, file, 1011, 5, 27356);
    			set_style(table, "width", "100%");
    			attr_dev(table, "class", "svelte-1g8gjzi");
    			add_location(table, file, 1010, 4, 27324);
    			attr_dev(div1, "class", "tableFixHead svelte-1g8gjzi");
    			add_location(div1, file, 1009, 3, 27292);
    			attr_dev(div2, "class", "svelte-1g8gjzi");
    			add_location(div2, file, 1008, 2, 27283);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, th1);
    			append_dev(tr, th2);
    			append_dev(table, t5);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[1] & /*full_message, inbound_contact_messages*/ 257) {
    				each_value_2 = /*inbound_contact_messages*/ ctx[31];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(1007:35) ",
    		ctx
    	});

    	return block;
    }

    // (910:33) 
    function create_if_block_2(ctx) {
    	let div21;
    	let div8;
    	let br0;
    	let t0;
    	let div0;
    	let t2;
    	let br1;
    	let t3;
    	let div1;
    	let label0;
    	let t5;
    	let input0;
    	let t6;
    	let input1;
    	let span0;
    	let t8;
    	let div2;
    	let t9;
    	let div3;
    	let t10;
    	let div4;
    	let label1;
    	let br2;
    	let t12;
    	let textarea;
    	let t13;
    	let div6;
    	let div5;
    	let button0;
    	let div5_style_value;
    	let t15;
    	let div7;
    	let blockquote0;
    	let t17;
    	let blockquote1;
    	let t19;
    	let blockquote2;
    	let t21;
    	let blockquote3;
    	let span1;
    	let t23;
    	let t24;
    	let div20;
    	let div9;
    	let t25;
    	let span2;
    	let t26;
    	let span2_class_value;
    	let t27;
    	let div14;
    	let div10;
    	let t29;
    	let div13;
    	let div11;
    	let button1;
    	let t31;
    	let button2;
    	let t33;
    	let div12;
    	let button3;
    	let t35;
    	let button4;
    	let t37;
    	let div19;
    	let div15;
    	let t39;
    	let div18;
    	let div16;
    	let raw_value = /*selected_form_link*/ ctx[33].html + "";
    	let t40;
    	let div17;
    	let select;
    	let mounted;
    	let dispose;

    	function select_block_type_2(ctx, dirty) {
    		if (/*business*/ ctx[19]) return create_if_block_4;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block0 = current_block_type(ctx);

    	function select_block_type_3(ctx, dirty) {
    		if (/*business*/ ctx[19]) return create_if_block_3;
    		return create_else_block_1;
    	}

    	let current_block_type_1 = select_block_type_3(ctx);
    	let if_block1 = current_block_type_1(ctx);
    	let each_value_1 = /*contact_form_links*/ ctx[35];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div21 = element("div");
    			div8 = element("div");
    			br0 = element("br");
    			t0 = space();
    			div0 = element("div");
    			div0.textContent = "Please enter Unique Information about yourself which you would be willing to share with anyone:";
    			t2 = space();
    			br1 = element("br");
    			t3 = space();
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name:";
    			t5 = space();
    			input0 = element("input");
    			t6 = space();
    			input1 = element("input");
    			span0 = element("span");
    			span0.textContent = "Business (if checked)";
    			t8 = space();
    			div2 = element("div");
    			if_block0.c();
    			t9 = space();
    			div3 = element("div");
    			if_block1.c();
    			t10 = space();
    			div4 = element("div");
    			label1 = element("label");
    			label1.textContent = "Cool Public Info";
    			br2 = element("br");
    			t12 = space();
    			textarea = element("textarea");
    			t13 = space();
    			div6 = element("div");
    			div5 = element("div");
    			button0 = element("button");
    			button0.textContent = "Create my contact profile.";
    			t15 = space();
    			div7 = element("div");
    			blockquote0 = element("blockquote");
    			blockquote0.textContent = "Enter your information above. This information will be used to make an identifier for sending and receiving messages.\n\t\t\t\tWhen you click on the button, \"Create my contact profile\", your information will got to a gateway server where it will be \n\t\t\t\tused to make an ID, called a CID. This \"User\" tab will store the CID for you. And, you will be able to download it along with \n\t\t\t\tspecial directory information and your security keys from your browser at any time. This information will never be sent from the\n\t\t\t\tbrowser by these pages.";
    			t17 = space();
    			blockquote1 = element("blockquote");
    			blockquote1.textContent = "The information should be unique.For example, I know that my name is shared by at least three other people on the planet,\n\t\t\t\tall of whom were born in the same year. But, they are from different towns or countries.";
    			t19 = space();
    			blockquote2 = element("blockquote");
    			blockquote2.textContent = "Some of the  information that you enter, not including keys, may be used later in an API link only if you have interests for which you would be willing to receive unsolicited mail. \n\t\t\t\tYou may choose the groups or business that may publish to topics that you select. You may make selections at a later time. And, the process of managing\n\t\t\t\ttopics will be workable on topics pages separate from these message pages.";
    			t21 = space();
    			blockquote3 = element("blockquote");
    			span1 = element("span");
    			span1.textContent = "Note:";
    			t23 = text(" no information will be sent to any organization as a result of signing up.\n\t\t\t\tAll information, excluding private keys, and your personalized assets such as your contact pages, public and encrypted,\n\t\t\t\twill be stored in the Interplanetary File System. All this information will be accessible from there through any service\n\t\t\t\tyou wish to use to access it.");
    			t24 = space();
    			div20 = element("div");
    			div9 = element("div");
    			t25 = text("status: ");
    			span2 = element("span");
    			t26 = text(/*signup_status*/ ctx[15]);
    			t27 = space();
    			div14 = element("div");
    			div10 = element("div");
    			div10.textContent = "drop a picture here";
    			t29 = space();
    			div13 = element("div");
    			div11 = element("div");
    			button1 = element("button");
    			button1.textContent = "∋ new";
    			t31 = space();
    			button2 = element("button");
    			button2.textContent = "∌ remove";
    			t33 = space();
    			div12 = element("div");
    			button3 = element("button");
    			button3.textContent = "▼ identity";
    			t35 = space();
    			button4 = element("button");
    			button4.textContent = "▲ identity";
    			t37 = space();
    			div19 = element("div");
    			div15 = element("div");
    			div15.textContent = "Select a contact from";
    			t39 = space();
    			div18 = element("div");
    			div16 = element("div");
    			t40 = space();
    			div17 = element("div");
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(br0, "class", "svelte-1g8gjzi");
    			add_location(br0, file, 912, 3, 22592);
    			attr_dev(div0, "class", "top_instructions svelte-1g8gjzi");
    			add_location(div0, file, 913, 3, 22600);
    			attr_dev(br1, "class", "svelte-1g8gjzi");
    			add_location(br1, file, 916, 3, 22745);
    			attr_dev(label0, "for", "name");
    			set_style(label0, "display", "inline");
    			attr_dev(label0, "class", "svelte-1g8gjzi");
    			add_location(label0, file, 918, 4, 22782);
    			attr_dev(input0, "id", "name");
    			attr_dev(input0, "placeholder", "Name");
    			set_style(input0, "display", "inline");
    			attr_dev(input0, "class", "svelte-1g8gjzi");
    			add_location(input0, file, 919, 4, 22842);
    			attr_dev(input1, "type", "checkbox");
    			set_style(input1, "display", "inline");
    			attr_dev(input1, "class", "svelte-1g8gjzi");
    			add_location(input1, file, 920, 4, 22924);
    			attr_dev(span0, "class", "svelte-1g8gjzi");
    			add_location(span0, file, 920, 76, 22996);
    			attr_dev(div1, "class", "inner_div svelte-1g8gjzi");
    			add_location(div1, file, 917, 3, 22753);
    			attr_dev(div2, "class", "inner_div svelte-1g8gjzi");
    			add_location(div2, file, 922, 3, 23044);
    			attr_dev(div3, "class", "inner_div svelte-1g8gjzi");
    			add_location(div3, file, 929, 3, 23432);
    			attr_dev(label1, "for", "self-text");
    			attr_dev(label1, "class", "svelte-1g8gjzi");
    			add_location(label1, file, 937, 3, 23875);
    			attr_dev(br2, "class", "svelte-1g8gjzi");
    			add_location(br2, file, 937, 50, 23922);
    			attr_dev(textarea, "id", "self-text");
    			attr_dev(textarea, "placeholder", "Something you would say to anyone about yourself");
    			attr_dev(textarea, "class", "svelte-1g8gjzi");
    			add_location(textarea, file, 938, 3, 23930);
    			attr_dev(div4, "class", "inner_div svelte-1g8gjzi");
    			add_location(div4, file, 936, 3, 23847);
    			attr_dev(button0, "class", "long_button svelte-1g8gjzi");
    			add_location(button0, file, 942, 5, 24241);

    			attr_dev(div5, "style", div5_style_value = /*green*/ ctx[29]
    			? "background-color:rgba(245,255,250,0.9)"
    			: "background-color:rgba(250,250,250,0.3)");

    			attr_dev(div5, "class", "svelte-1g8gjzi");
    			add_location(div5, file, 941, 4, 24125);
    			attr_dev(div6, "class", "add-profile-div svelte-1g8gjzi");
    			set_style(div6, "text-align", "center");
    			add_location(div6, file, 940, 3, 24064);
    			attr_dev(blockquote0, "class", "svelte-1g8gjzi");
    			add_location(blockquote0, file, 946, 4, 24383);
    			attr_dev(blockquote1, "class", "svelte-1g8gjzi");
    			add_location(blockquote1, file, 953, 4, 24959);
    			attr_dev(blockquote2, "class", "svelte-1g8gjzi");
    			add_location(blockquote2, file, 957, 4, 25213);
    			set_style(span1, "color", "blue");
    			attr_dev(span1, "class", "svelte-1g8gjzi");
    			add_location(span1, file, 963, 4, 25686);
    			attr_dev(blockquote3, "class", "svelte-1g8gjzi");
    			add_location(blockquote3, file, 962, 4, 25669);
    			attr_dev(div7, "class", "nice_message svelte-1g8gjzi");
    			add_location(div7, file, 945, 3, 24352);
    			attr_dev(div8, "class", "signerupper svelte-1g8gjzi");
    			add_location(div8, file, 911, 2, 22563);

    			attr_dev(span2, "class", span2_class_value = "" + (null_to_empty(/*signup_status*/ ctx[15] === "OK"
    			? "good-status"
    			: "bad-status") + " svelte-1g8gjzi"));

    			add_location(span2, file, 972, 12, 26191);
    			attr_dev(div9, "class", "signup-status svelte-1g8gjzi");
    			add_location(div9, file, 971, 3, 26151);
    			attr_dev(div10, "class", "picture-drop svelte-1g8gjzi");
    			add_location(div10, file, 975, 4, 26305);
    			attr_dev(button1, "class", "svelte-1g8gjzi");
    			add_location(button1, file, 980, 6, 26420);
    			attr_dev(button2, "class", "svelte-1g8gjzi");
    			add_location(button2, file, 981, 6, 26482);
    			attr_dev(div11, "class", "contact_controls svelte-1g8gjzi");
    			add_location(div11, file, 979, 5, 26383);
    			attr_dev(button3, "class", "svelte-1g8gjzi");
    			add_location(button3, file, 984, 6, 26604);
    			attr_dev(button4, "class", "svelte-1g8gjzi");
    			add_location(button4, file, 985, 6, 26638);
    			attr_dev(div12, "class", "contact_controls svelte-1g8gjzi");
    			add_location(div12, file, 983, 5, 26567);
    			attr_dev(div13, "class", "svelte-1g8gjzi");
    			add_location(div13, file, 978, 4, 26372);
    			attr_dev(div14, "class", "svelte-1g8gjzi");
    			add_location(div14, file, 974, 3, 26295);
    			attr_dev(div15, "class", "contact_form_list svelte-1g8gjzi");
    			add_location(div15, file, 990, 4, 26713);
    			attr_dev(div16, "class", "selected_form_link-display svelte-1g8gjzi");
    			add_location(div16, file, 992, 5, 26787);
    			attr_dev(select, "size", 10);
    			set_style(select, "width", "100%");
    			set_style(select, "height", "90px");
    			set_style(select, "padding-left", "4px");
    			attr_dev(select, "class", "svelte-1g8gjzi");
    			if (/*form_index*/ ctx[12] === void 0) add_render_callback(() => /*select_change_handler_1*/ ctx[61].call(select));
    			add_location(select, file, 996, 6, 26918);
    			attr_dev(div17, "class", "tableFixHead svelte-1g8gjzi");
    			add_location(div17, file, 995, 5, 26884);
    			attr_dev(div18, "class", "svelte-1g8gjzi");
    			add_location(div18, file, 991, 4, 26776);
    			attr_dev(div19, "class", "svelte-1g8gjzi");
    			add_location(div19, file, 989, 3, 26703);
    			attr_dev(div20, "class", "signerupper svelte-1g8gjzi");
    			add_location(div20, file, 970, 2, 26122);
    			attr_dev(div21, "class", "signup-grid-container svelte-1g8gjzi");
    			add_location(div21, file, 910, 1, 22525);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div21, anchor);
    			append_dev(div21, div8);
    			append_dev(div8, br0);
    			append_dev(div8, t0);
    			append_dev(div8, div0);
    			append_dev(div8, t2);
    			append_dev(div8, br1);
    			append_dev(div8, t3);
    			append_dev(div8, div1);
    			append_dev(div1, label0);
    			append_dev(div1, t5);
    			append_dev(div1, input0);
    			set_input_value(input0, /*name*/ ctx[2]);
    			append_dev(div1, t6);
    			append_dev(div1, input1);
    			input1.checked = /*business*/ ctx[19];
    			append_dev(div1, span0);
    			append_dev(div8, t8);
    			append_dev(div8, div2);
    			if_block0.m(div2, null);
    			append_dev(div8, t9);
    			append_dev(div8, div3);
    			if_block1.m(div3, null);
    			append_dev(div8, t10);
    			append_dev(div8, div4);
    			append_dev(div4, label1);
    			append_dev(div4, br2);
    			append_dev(div4, t12);
    			append_dev(div4, textarea);
    			set_input_value(textarea, /*cool_public_info*/ ctx[18]);
    			append_dev(div8, t13);
    			append_dev(div8, div6);
    			append_dev(div6, div5);
    			append_dev(div5, button0);
    			append_dev(div8, t15);
    			append_dev(div8, div7);
    			append_dev(div7, blockquote0);
    			append_dev(div7, t17);
    			append_dev(div7, blockquote1);
    			append_dev(div7, t19);
    			append_dev(div7, blockquote2);
    			append_dev(div7, t21);
    			append_dev(div7, blockquote3);
    			append_dev(blockquote3, span1);
    			append_dev(blockquote3, t23);
    			append_dev(div21, t24);
    			append_dev(div21, div20);
    			append_dev(div20, div9);
    			append_dev(div9, t25);
    			append_dev(div9, span2);
    			append_dev(span2, t26);
    			append_dev(div20, t27);
    			append_dev(div20, div14);
    			append_dev(div14, div10);
    			append_dev(div14, t29);
    			append_dev(div14, div13);
    			append_dev(div13, div11);
    			append_dev(div11, button1);
    			append_dev(div11, t31);
    			append_dev(div11, button2);
    			append_dev(div13, t33);
    			append_dev(div13, div12);
    			append_dev(div12, button3);
    			append_dev(div12, t35);
    			append_dev(div12, button4);
    			append_dev(div20, t37);
    			append_dev(div20, div19);
    			append_dev(div19, div15);
    			append_dev(div19, t39);
    			append_dev(div19, div18);
    			append_dev(div18, div16);
    			div16.innerHTML = raw_value;
    			append_dev(div18, t40);
    			append_dev(div18, div17);
    			append_dev(div17, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*form_index*/ ctx[12]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[54]),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[55]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[60]),
    					listen_dev(button0, "click", /*add_profile*/ ctx[36], false, false, false),
    					listen_dev(button1, "click", /*clear_identify_form*/ ctx[37], false, false, false),
    					listen_dev(button2, "click", /*remove_identify_seen_in_form*/ ctx[38], false, false, false),
    					listen_dev(select, "change", /*select_change_handler_1*/ ctx[61])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*name*/ 4 && input0.value !== /*name*/ ctx[2]) {
    				set_input_value(input0, /*name*/ ctx[2]);
    			}

    			if (dirty[0] & /*business*/ 524288) {
    				input1.checked = /*business*/ ctx[19];
    			}

    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div2, null);
    				}
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_3(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div3, null);
    				}
    			}

    			if (dirty[0] & /*cool_public_info*/ 262144) {
    				set_input_value(textarea, /*cool_public_info*/ ctx[18]);
    			}

    			if (dirty[0] & /*green*/ 536870912 && div5_style_value !== (div5_style_value = /*green*/ ctx[29]
    			? "background-color:rgba(245,255,250,0.9)"
    			: "background-color:rgba(250,250,250,0.3)")) {
    				attr_dev(div5, "style", div5_style_value);
    			}

    			if (dirty[0] & /*signup_status*/ 32768) set_data_dev(t26, /*signup_status*/ ctx[15]);

    			if (dirty[0] & /*signup_status*/ 32768 && span2_class_value !== (span2_class_value = "" + (null_to_empty(/*signup_status*/ ctx[15] === "OK"
    			? "good-status"
    			: "bad-status") + " svelte-1g8gjzi"))) {
    				attr_dev(span2, "class", span2_class_value);
    			}

    			if (dirty[1] & /*selected_form_link*/ 4 && raw_value !== (raw_value = /*selected_form_link*/ ctx[33].html + "")) div16.innerHTML = raw_value;
    			if (dirty[1] & /*contact_form_links*/ 16) {
    				each_value_1 = /*contact_form_links*/ ctx[35];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty[0] & /*form_index*/ 4096) {
    				select_option(select, /*form_index*/ ctx[12]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div21);
    			if_block0.d();
    			if_block1.d();
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(910:33) ",
    		ctx
    	});

    	return block;
    }

    // (869:1) {#if (active === 'Identify')}
    function create_if_block(ctx) {
    	let div1;
    	let t0;
    	let div0;
    	let t1;
    	let br0;
    	let t2;
    	let br1;
    	let t3;
    	let br2;
    	let t4;
    	let br3;
    	let t5;
    	let br4;
    	let t6;
    	let br5;
    	let t7;
    	let br6;
    	let t8;

    	function select_block_type_1(ctx, dirty) {
    		if (/*active_user*/ ctx[3] || /*adding_new*/ ctx[25]) return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if_block.c();
    			t0 = space();
    			div0 = element("div");
    			t1 = text("Pro-mail is like e-mail. \n\t\t\t");
    			br0 = element("br");
    			t2 = text("\n\t\t\tBut, where e-mail is complicated, Pro-mail is simpler.\n\t\t\t");
    			br1 = element("br");
    			t3 = text("\n\t\t\tAnd, where Pro-mail is more complicated, it's more fun.\n\t\t\t");
    			br2 = element("br");
    			t4 = text("\n\t\t\tNo just more fun.\n\t\t\t");
    			br3 = element("br");
    			t5 = text("\n\t\t\tMore secure\n\t\t\t");
    			br4 = element("br");
    			t6 = text("\n\t\t\tMore customizable.\n\t\t\t");
    			br5 = element("br");
    			t7 = text("\n\t\t\tMore Manageable\n\t\t\t");
    			br6 = element("br");
    			t8 = text("\n\t\t\tEasier to Filter and Maintain");
    			attr_dev(br0, "class", "svelte-1g8gjzi");
    			add_location(br0, file, 893, 3, 22193);
    			attr_dev(br1, "class", "svelte-1g8gjzi");
    			add_location(br1, file, 895, 3, 22259);
    			attr_dev(br2, "class", "svelte-1g8gjzi");
    			add_location(br2, file, 897, 3, 22326);
    			attr_dev(br3, "class", "svelte-1g8gjzi");
    			add_location(br3, file, 899, 3, 22355);
    			attr_dev(br4, "class", "svelte-1g8gjzi");
    			add_location(br4, file, 901, 3, 22378);
    			attr_dev(br5, "class", "svelte-1g8gjzi");
    			add_location(br5, file, 903, 3, 22408);
    			attr_dev(br6, "class", "svelte-1g8gjzi");
    			add_location(br6, file, 905, 3, 22435);
    			attr_dev(div0, "class", "front-page-explain svelte-1g8gjzi");
    			add_location(div0, file, 891, 2, 22128);
    			attr_dev(div1, "class", "splash-if-you-will svelte-1g8gjzi");
    			set_style(div1, "height", "fit-content");
    			add_location(div1, file, 869, 1, 21364);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if_block.m(div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, t1);
    			append_dev(div0, br0);
    			append_dev(div0, t2);
    			append_dev(div0, br1);
    			append_dev(div0, t3);
    			append_dev(div0, br2);
    			append_dev(div0, t4);
    			append_dev(div0, br3);
    			append_dev(div0, t5);
    			append_dev(div0, br4);
    			append_dev(div0, t6);
    			append_dev(div0, br5);
    			append_dev(div0, t7);
    			append_dev(div0, br6);
    			append_dev(div0, t8);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div1, t0);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(869:1) {#if (active === 'Identify')}",
    		ctx
    	});

    	return block;
    }

    // (1112:7) {#each filtered_manifest_contact_form_list as contact_item, manifest_index}
    function create_each_block_5(ctx) {
    	let option;
    	let t_value = /*contact_item*/ ctx[106].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*manifest_index*/ ctx[14];
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-1g8gjzi");
    			add_location(option, file, 1112, 8, 31693);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filtered_manifest_contact_form_list*/ 1024 && t_value !== (t_value = /*contact_item*/ ctx[106].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(1112:7) {#each filtered_manifest_contact_form_list as contact_item, manifest_index}",
    		ctx
    	});

    	return block;
    }

    // (1052:4) {#each filteredIndviduals as individual, i}
    function create_each_block_4(ctx) {
    	let option;
    	let t_value = /*individual*/ ctx[104].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*i*/ ctx[11];
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-1g8gjzi");
    			add_location(option, file, 1052, 5, 28948);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filteredIndviduals*/ 512 && t_value !== (t_value = /*individual*/ ctx[104].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(1052:4) {#each filteredIndviduals as individual, i}",
    		ctx
    	});

    	return block;
    }

    // (1070:4) {:else}
    function create_else_block_5(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Person";
    			attr_dev(span, "class", "svelte-1g8gjzi");
    			add_location(span, file, 1070, 5, 29685);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_5.name,
    		type: "else",
    		source: "(1070:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (1068:4) {#if c_business }
    function create_if_block_10(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Business";
    			attr_dev(span, "class", "svelte-1g8gjzi");
    			add_location(span, file, 1068, 5, 29646);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(1068:4) {#if c_business }",
    		ctx
    	});

    	return block;
    }

    // (1077:4) {:else}
    function create_else_block_4(ctx) {
    	let label;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "DOB: ";
    			input = element("input");
    			attr_dev(label, "for", "DOB");
    			set_style(label, "display", "inline");
    			attr_dev(label, "class", "svelte-1g8gjzi");
    			add_location(label, file, 1077, 5, 29957);
    			attr_dev(input, "id", "DOB");
    			attr_dev(input, "placeholder", "Date of Birth");
    			set_style(input, "display", "inline");
    			attr_dev(input, "class", "svelte-1g8gjzi");
    			add_location(input, file, 1077, 59, 30011);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*c_DOB*/ ctx[21]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_5*/ ctx[67]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*c_DOB*/ 2097152 && input.value !== /*c_DOB*/ ctx[21]) {
    				set_input_value(input, /*c_DOB*/ ctx[21]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_4.name,
    		type: "else",
    		source: "(1077:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (1075:4) {#if c_business }
    function create_if_block_9(ctx) {
    	let label;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Year of Inception: ";
    			input = element("input");
    			attr_dev(label, "for", "DOB");
    			set_style(label, "display", "inline");
    			attr_dev(label, "class", "svelte-1g8gjzi");
    			add_location(label, file, 1075, 5, 29780);
    			attr_dev(input, "id", "DOB");
    			attr_dev(input, "placeholder", "Year of Inception");
    			set_style(input, "display", "inline");
    			attr_dev(input, "class", "svelte-1g8gjzi");
    			add_location(input, file, 1075, 73, 29848);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*c_DOB*/ ctx[21]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_4*/ ctx[66]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*c_DOB*/ 2097152 && input.value !== /*c_DOB*/ ctx[21]) {
    				set_input_value(input, /*c_DOB*/ ctx[21]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(1075:4) {#if c_business }",
    		ctx
    	});

    	return block;
    }

    // (1084:4) {:else}
    function create_else_block_3(ctx) {
    	let label;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Place of Origin: ";
    			input = element("input");
    			attr_dev(label, "for", "POO");
    			set_style(label, "display", "inline");
    			attr_dev(label, "class", "svelte-1g8gjzi");
    			add_location(label, file, 1084, 5, 30352);
    			attr_dev(input, "id", "POO");
    			attr_dev(input, "placeholder", "Place of Origin");
    			set_style(input, "display", "inline");
    			attr_dev(input, "class", "svelte-1g8gjzi");
    			add_location(input, file, 1084, 71, 30418);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*c_place_of_origin*/ ctx[22]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_7*/ ctx[69]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*c_place_of_origin*/ 4194304 && input.value !== /*c_place_of_origin*/ ctx[22]) {
    				set_input_value(input, /*c_place_of_origin*/ ctx[22]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3.name,
    		type: "else",
    		source: "(1084:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (1082:4) {#if c_business }
    function create_if_block_8(ctx) {
    	let label;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Main Office: ";
    			input = element("input");
    			attr_dev(label, "for", "POO");
    			set_style(label, "display", "inline");
    			attr_dev(label, "class", "svelte-1g8gjzi");
    			add_location(label, file, 1082, 5, 30174);
    			attr_dev(input, "id", "POO");
    			attr_dev(input, "placeholder", "Main Office");
    			set_style(input, "display", "inline");
    			attr_dev(input, "class", "svelte-1g8gjzi");
    			add_location(input, file, 1082, 68, 30237);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*c_place_of_origin*/ ctx[22]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_6*/ ctx[68]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*c_place_of_origin*/ 4194304 && input.value !== /*c_place_of_origin*/ ctx[22]) {
    				set_input_value(input, /*c_place_of_origin*/ ctx[22]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(1082:4) {#if c_business }",
    		ctx
    	});

    	return block;
    }

    // (1037:4) {#each inbound_solicitation_messages as a_message, i_i }
    function create_each_block_3(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*a_message*/ ctx[101].date + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*a_message*/ ctx[101].name + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*a_message*/ ctx[101].subject + "";
    	let t4;
    	let t5;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			attr_dev(td0, "class", "date svelte-1g8gjzi");
    			set_style(td0, "width", "20%");
    			set_style(td0, "text-align", "center");
    			add_location(td0, file, 1038, 6, 28455);
    			attr_dev(td1, "class", "sender svelte-1g8gjzi");
    			set_style(td1, "width", "30%");
    			add_location(td1, file, 1039, 6, 28537);
    			attr_dev(td2, "class", "subject svelte-1g8gjzi");
    			set_style(td2, "width", "60%");
    			add_location(td2, file, 1040, 6, 28603);
    			attr_dev(tr, "id", "m_intro_" + /*i_i*/ ctx[47]);
    			attr_dev(tr, "class", "element-poster svelte-1g8gjzi");
    			add_location(tr, file, 1037, 5, 28347);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(tr, "click", /*full_message*/ ctx[39], false, false, false),
    					listen_dev(tr, "mouseover", show_subject, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*inbound_solicitation_messages*/ 1073741824 && t0_value !== (t0_value = /*a_message*/ ctx[101].date + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*inbound_solicitation_messages*/ 1073741824 && t2_value !== (t2_value = /*a_message*/ ctx[101].name + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*inbound_solicitation_messages*/ 1073741824 && t4_value !== (t4_value = /*a_message*/ ctx[101].subject + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(1037:4) {#each inbound_solicitation_messages as a_message, i_i }",
    		ctx
    	});

    	return block;
    }

    // (1017:4) {#each inbound_contact_messages as a_message, c_i }
    function create_each_block_2(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*a_message*/ ctx[101].date + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*a_message*/ ctx[101].name + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*a_message*/ ctx[101].subject + "";
    	let t4;
    	let t5;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			attr_dev(td0, "class", "date svelte-1g8gjzi");
    			set_style(td0, "width", "20%");
    			set_style(td0, "text-align", "center");
    			add_location(td0, file, 1018, 6, 27696);
    			attr_dev(td1, "class", "sender svelte-1g8gjzi");
    			set_style(td1, "width", "30%");
    			add_location(td1, file, 1019, 6, 27778);
    			attr_dev(td2, "class", "subject svelte-1g8gjzi");
    			set_style(td2, "width", "60%");
    			add_location(td2, file, 1020, 6, 27844);
    			attr_dev(tr, "id", "m_contact_" + /*c_i*/ ctx[46]);
    			attr_dev(tr, "class", "element-poster svelte-1g8gjzi");
    			add_location(tr, file, 1017, 5, 27586);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(tr, "click", /*full_message*/ ctx[39], false, false, false),
    					listen_dev(tr, "mouseover", show_subject, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[1] & /*inbound_contact_messages*/ 1 && t0_value !== (t0_value = /*a_message*/ ctx[101].date + "")) set_data_dev(t0, t0_value);
    			if (dirty[1] & /*inbound_contact_messages*/ 1 && t2_value !== (t2_value = /*a_message*/ ctx[101].name + "")) set_data_dev(t2, t2_value);
    			if (dirty[1] & /*inbound_contact_messages*/ 1 && t4_value !== (t4_value = /*a_message*/ ctx[101].subject + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(1017:4) {#each inbound_contact_messages as a_message, c_i }",
    		ctx
    	});

    	return block;
    }

    // (926:4) {:else}
    function create_else_block_2(ctx) {
    	let label;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "DOB: ";
    			input = element("input");
    			attr_dev(label, "for", "DOB");
    			set_style(label, "display", "inline");
    			attr_dev(label, "class", "svelte-1g8gjzi");
    			add_location(label, file, 926, 5, 23269);
    			attr_dev(input, "id", "DOB");
    			attr_dev(input, "placeholder", "Date of Birth");
    			set_style(input, "display", "inline");
    			attr_dev(input, "class", "svelte-1g8gjzi");
    			add_location(input, file, 926, 59, 23323);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*DOB*/ ctx[16]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_1*/ ctx[57]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*DOB*/ 65536 && input.value !== /*DOB*/ ctx[16]) {
    				set_input_value(input, /*DOB*/ ctx[16]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(926:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (924:4) {#if business }
    function create_if_block_4(ctx) {
    	let label;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Year of Inception: ";
    			input = element("input");
    			attr_dev(label, "for", "DOB");
    			set_style(label, "display", "inline");
    			attr_dev(label, "class", "svelte-1g8gjzi");
    			add_location(label, file, 924, 5, 23094);
    			attr_dev(input, "id", "DOB");
    			attr_dev(input, "placeholder", "Year of Inception");
    			set_style(input, "display", "inline");
    			attr_dev(input, "class", "svelte-1g8gjzi");
    			add_location(input, file, 924, 73, 23162);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*DOB*/ ctx[16]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[56]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*DOB*/ 65536 && input.value !== /*DOB*/ ctx[16]) {
    				set_input_value(input, /*DOB*/ ctx[16]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(924:4) {#if business }",
    		ctx
    	});

    	return block;
    }

    // (933:4) {:else}
    function create_else_block_1(ctx) {
    	let label;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Place of Origin: ";
    			input = element("input");
    			attr_dev(label, "for", "POO");
    			set_style(label, "display", "inline");
    			attr_dev(label, "class", "svelte-1g8gjzi");
    			add_location(label, file, 933, 5, 23658);
    			attr_dev(input, "id", "POO");
    			attr_dev(input, "placeholder", "Place of Origin");
    			set_style(input, "display", "inline");
    			attr_dev(input, "class", "svelte-1g8gjzi");
    			add_location(input, file, 933, 71, 23724);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*place_of_origin*/ ctx[17]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_3*/ ctx[59]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*place_of_origin*/ 131072 && input.value !== /*place_of_origin*/ ctx[17]) {
    				set_input_value(input, /*place_of_origin*/ ctx[17]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(933:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (931:4) {#if business }
    function create_if_block_3(ctx) {
    	let label;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Main Office: ";
    			input = element("input");
    			attr_dev(label, "for", "POO");
    			set_style(label, "display", "inline");
    			attr_dev(label, "class", "svelte-1g8gjzi");
    			add_location(label, file, 931, 5, 23482);
    			attr_dev(input, "id", "POO");
    			attr_dev(input, "placeholder", "Main Office");
    			set_style(input, "display", "inline");
    			attr_dev(input, "class", "svelte-1g8gjzi");
    			add_location(input, file, 931, 68, 23545);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*place_of_origin*/ ctx[17]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_2*/ ctx[58]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*place_of_origin*/ 131072 && input.value !== /*place_of_origin*/ ctx[17]) {
    				set_input_value(input, /*place_of_origin*/ ctx[17]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(931:4) {#if business }",
    		ctx
    	});

    	return block;
    }

    // (998:7) {#each contact_form_links as form_link, form_index}
    function create_each_block_1(ctx) {
    	let option;
    	let t_value = /*form_link*/ ctx[99].link + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*form_index*/ ctx[12];
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-1g8gjzi");
    			add_location(option, file, 998, 8, 27077);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(998:7) {#each contact_form_links as form_link, form_index}",
    		ctx
    	});

    	return block;
    }

    // (884:2) {:else}
    function create_else_block(ctx) {
    	let div1;
    	let t0;
    	let div0;
    	let t1;
    	let span;
    	let t3;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			t0 = text("Please join us in using this way of sending messages.\n\t\t\t");
    			div0 = element("div");
    			t1 = text("Click on the ");
    			span = element("span");
    			span.textContent = "User";
    			t3 = text(" tab.");
    			attr_dev(span, "class", "svelte-1g8gjzi");
    			add_location(span, file, 887, 17, 22076);
    			attr_dev(div0, "class", "svelte-1g8gjzi");
    			add_location(div0, file, 886, 3, 22053);
    			attr_dev(div1, "class", "splash-if-you-will svelte-1g8gjzi");
    			add_location(div1, file, 884, 2, 21959);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, t1);
    			append_dev(div0, span);
    			append_dev(div0, t3);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(884:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (871:2) {#if active_user || adding_new }
    function create_if_block_1(ctx) {
    	let div1;
    	let t0;
    	let span;

    	let t1_value = (/*active_user*/ ctx[3]
    	? /*active_user*/ ctx[3].name
    	: "being created") + "";

    	let t1;
    	let t2;
    	let br;
    	let t3;
    	let div0;
    	let select;
    	let mounted;
    	let dispose;
    	let each_value = /*known_users*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			t0 = text("The current user is ");
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = text(".\n\t\t\t");
    			br = element("br");
    			t3 = text("\n\t\t\tNot you? Select from the list below or Add yourself with the User tab.\n\t\t\t");
    			div0 = element("div");
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(span, "class", "svelte-1g8gjzi");
    			add_location(span, file, 872, 23, 21518);
    			attr_dev(br, "class", "svelte-1g8gjzi");
    			add_location(br, file, 873, 3, 21587);
    			attr_dev(select, "size", 10);
    			set_style(select, "text-align", "center");
    			attr_dev(select, "class", "svelte-1g8gjzi");
    			if (/*u_index*/ ctx[13] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[53].call(select));
    			add_location(select, file, 876, 4, 21727);
    			attr_dev(div0, "class", "user-options svelte-1g8gjzi");
    			set_style(div0, "text-align", "center");
    			add_location(div0, file, 875, 3, 21669);
    			set_style(div1, "height", "fit-content");
    			attr_dev(div1, "class", "svelte-1g8gjzi");
    			add_location(div1, file, 871, 2, 21462);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t0);
    			append_dev(div1, span);
    			append_dev(span, t1);
    			append_dev(div1, t2);
    			append_dev(div1, br);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			append_dev(div0, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*u_index*/ ctx[13]);

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*select_change_handler*/ ctx[53]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*active_user*/ 8 && t1_value !== (t1_value = (/*active_user*/ ctx[3]
    			? /*active_user*/ ctx[3].name
    			: "being created") + "")) set_data_dev(t1, t1_value);

    			if (dirty[0] & /*known_users*/ 16) {
    				each_value = /*known_users*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty[0] & /*u_index*/ 8192) {
    				select_option(select, /*u_index*/ ctx[13]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(871:2) {#if active_user || adding_new }",
    		ctx
    	});

    	return block;
    }

    // (878:5) {#each known_users as maybe_user, u_index }
    function create_each_block(ctx) {
    	let option;
    	let t_value = /*maybe_user*/ ctx[97].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*u_index*/ ctx[13];
    			option.value = option.__value;
    			attr_dev(option, "class", "svelte-1g8gjzi");
    			add_location(option, file, 878, 6, 21849);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*known_users*/ 16 && t_value !== (t_value = /*maybe_user*/ ctx[97].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(878:5) {#each known_users as maybe_user, u_index }",
    		ctx
    	});

    	return block;
    }

    // (1189:0) <FloatWindow title={message_selected.name} scale_size={window_scale} index={0} use_smoke={false}>
    function create_default_slot_1(ctx) {
    	let messagedisplay;
    	let current;
    	const messagedisplay_spread_levels = [/*message_selected*/ ctx[32]];
    	let messagedisplay_props = {};

    	for (let i = 0; i < messagedisplay_spread_levels.length; i += 1) {
    		messagedisplay_props = assign(messagedisplay_props, messagedisplay_spread_levels[i]);
    	}

    	messagedisplay = new MessageDisplay({
    			props: messagedisplay_props,
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(messagedisplay.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(messagedisplay, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const messagedisplay_changes = (dirty[1] & /*message_selected*/ 2)
    			? get_spread_update(messagedisplay_spread_levels, [get_spread_object(/*message_selected*/ ctx[32])])
    			: {};

    			messagedisplay.$set(messagedisplay_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(messagedisplay.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(messagedisplay.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(messagedisplay, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(1189:0) <FloatWindow title={message_selected.name} scale_size={window_scale} index={0} use_smoke={false}>",
    		ctx
    	});

    	return block;
    }

    // (1193:0) <FloatWindow title={selected.name} scale_size={window_scale} index={1} use_smoke={false}>
    function create_default_slot(ctx) {
    	let messageeditor;
    	let current;
    	const messageeditor_spread_levels = [/*selected*/ ctx[8], { active_user: /*active_user*/ ctx[3] }];
    	let messageeditor_props = {};

    	for (let i = 0; i < messageeditor_spread_levels.length; i += 1) {
    		messageeditor_props = assign(messageeditor_props, messageeditor_spread_levels[i]);
    	}

    	messageeditor = new MessageEditor({
    			props: messageeditor_props,
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(messageeditor.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(messageeditor, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const messageeditor_changes = (dirty[0] & /*selected, active_user*/ 264)
    			? get_spread_update(messageeditor_spread_levels, [
    					dirty[0] & /*selected*/ 256 && get_spread_object(/*selected*/ ctx[8]),
    					dirty[0] & /*active_user*/ 8 && { active_user: /*active_user*/ ctx[3] }
    				])
    			: {};

    			messageeditor.$set(messageeditor_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(messageeditor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(messageeditor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(messageeditor, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(1193:0) <FloatWindow title={selected.name} scale_size={window_scale} index={1} use_smoke={false}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div;
    	let tabbar;
    	let updating_active;
    	let t0;
    	let br;
    	let t1;
    	let t2;
    	let floatwindow0;
    	let t3;
    	let floatwindow1;
    	let current;

    	function tabbar_active_binding(value) {
    		/*tabbar_active_binding*/ ctx[52](value);
    	}

    	let tabbar_props = {
    		tabs: [
    			"Identify",
    			"User",
    			"Messages",
    			"Introductions",
    			"Contacts",
    			"Manifest",
    			"About Us"
    		],
    		$$slots: {
    			default: [
    				create_default_slot_2,
    				({ tab }) => ({ 108: tab }),
    				({ tab }) => [0, 0, 0, tab ? 32768 : 0]
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*active*/ ctx[28] !== void 0) {
    		tabbar_props.active = /*active*/ ctx[28];
    	}

    	tabbar = new TabBar({ props: tabbar_props, $$inline: true });
    	binding_callbacks.push(() => bind(tabbar, "active", tabbar_active_binding));

    	function select_block_type(ctx, dirty) {
    		if (/*active*/ ctx[28] === "Identify") return create_if_block;
    		if (/*active*/ ctx[28] === "User") return create_if_block_2;
    		if (/*active*/ ctx[28] === "Messages") return create_if_block_5;
    		if (/*active*/ ctx[28] === "Introductions") return create_if_block_6;
    		if (/*active*/ ctx[28] === "Contacts") return create_if_block_7;
    		if (/*active*/ ctx[28] === "Manifest") return create_if_block_11;
    		if (/*active*/ ctx[28] === "About Us") return create_if_block_12;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	floatwindow0 = new FloatWindow({
    			props: {
    				title: /*message_selected*/ ctx[32].name,
    				scale_size: /*window_scale*/ ctx[34],
    				index: 0,
    				use_smoke: false,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	floatwindow1 = new FloatWindow({
    			props: {
    				title: /*selected*/ ctx[8].name,
    				scale_size: /*window_scale*/ ctx[34],
    				index: 1,
    				use_smoke: false,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(tabbar.$$.fragment);
    			t0 = space();
    			br = element("br");
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			create_component(floatwindow0.$$.fragment);
    			t3 = space();
    			create_component(floatwindow1.$$.fragment);
    			attr_dev(br, "class", "svelte-1g8gjzi");
    			add_location(br, file, 866, 2, 21326);
    			attr_dev(div, "class", "svelte-1g8gjzi");
    			add_location(div, file, 856, 0, 20947);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(tabbar, div, null);
    			append_dev(div, t0);
    			append_dev(div, br);
    			append_dev(div, t1);
    			if (if_block) if_block.m(div, null);
    			insert_dev(target, t2, anchor);
    			mount_component(floatwindow0, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(floatwindow1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tabbar_changes = {};

    			if (dirty[0] & /*active*/ 268435456 | dirty[3] & /*$$scope, tab*/ 98304) {
    				tabbar_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_active && dirty[0] & /*active*/ 268435456) {
    				updating_active = true;
    				tabbar_changes.active = /*active*/ ctx[28];
    				add_flush_callback(() => updating_active = false);
    			}

    			tabbar.$set(tabbar_changes);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}

    			const floatwindow0_changes = {};
    			if (dirty[1] & /*message_selected*/ 2) floatwindow0_changes.title = /*message_selected*/ ctx[32].name;
    			if (dirty[1] & /*window_scale*/ 8) floatwindow0_changes.scale_size = /*window_scale*/ ctx[34];

    			if (dirty[1] & /*message_selected*/ 2 | dirty[3] & /*$$scope*/ 65536) {
    				floatwindow0_changes.$$scope = { dirty, ctx };
    			}

    			floatwindow0.$set(floatwindow0_changes);
    			const floatwindow1_changes = {};
    			if (dirty[0] & /*selected*/ 256) floatwindow1_changes.title = /*selected*/ ctx[8].name;
    			if (dirty[1] & /*window_scale*/ 8) floatwindow1_changes.scale_size = /*window_scale*/ ctx[34];

    			if (dirty[0] & /*selected, active_user*/ 264 | dirty[3] & /*$$scope*/ 65536) {
    				floatwindow1_changes.$$scope = { dirty, ctx };
    			}

    			floatwindow1.$set(floatwindow1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabbar.$$.fragment, local);
    			transition_in(floatwindow0.$$.fragment, local);
    			transition_in(floatwindow1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabbar.$$.fragment, local);
    			transition_out(floatwindow0.$$.fragment, local);
    			transition_out(floatwindow1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(tabbar);

    			if (if_block) {
    				if_block.d();
    			}

    			if (detaching) detach_dev(t2);
    			destroy_component(floatwindow0, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(floatwindow1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function popup_size() {
    	let smallest_w = 200; // smallest and bigget willing to accomodate
    	let biggest_w = 3000;
    	let smallest_h = 600;
    	let biggest_h = 1000;

    	// bounded window width
    	let w = Math.max(smallest_w, window.innerWidth);

    	w = Math.min(biggest_w, w);

    	// bounded window height
    	let h = Math.max(smallest_h, window.innerHeight);

    	h = Math.min(biggest_h, h);
    	let p_range;
    	let P;

    	//	percentage h range 
    	let h_p_max = 0.96;

    	let h_p_min = 0.75;
    	p_range = h_p_max - h_p_min;
    	P = (biggest_h - h) / (biggest_h - smallest_h);
    	console.log("P h: " + P);
    	let h_scale = P * p_range + h_p_min;

    	//	percentage w range 
    	let w_p_max = 0.96;

    	let w_p_min = 0.2;
    	p_range = w_p_max - w_p_min;
    	P = (biggest_w - w) / (biggest_w - smallest_w);
    	console.log("P w: " + P);
    	let w_scale = P * p_range + w_p_min;

    	// Setting the current height & width 
    	// to the elements 
    	return { "w": w_scale, "h": h_scale };
    }

    // MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES
    // MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES
    function pop_editor() {
    	start_floating_window(1);
    }

    function show_subject() {
    	
    }

    // ---- ---- ---- ---- ---- ---- ----
    function preview_contact_form(ev) {
    	
    } // start_floating_window(2);

    function instance($$self, $$props, $$invalidate) {
    	let filteredIndviduals;
    	let filtered_manifest_contact_form_list;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let cid = "";
    	let signup_status = "OK";
    	let start_of_messages = 0;
    	let messages_per_pate = 100;
    	let prefix = "";
    	let man_prefix = "";
    	let i = 0;
    	let c_i = 0;
    	let i_i = 0;
    	let form_index = 0;
    	let name = "";
    	let DOB = "";
    	let place_of_origin = "";
    	let cool_public_info = "";
    	let business = false;
    	let c_name = "";
    	let c_DOB = "";
    	let c_place_of_origin = "";
    	let c_cool_public_info = "";
    	let c_business = false;
    	let today = new Date().toUTCString();
    	let active_user = false;
    	let active_identity = false;
    	let known_users = [false];
    	let known_identities = [false];
    	let u_index = 0;
    	let adding_new = false;
    	let manifest_selected_entry = false;
    	let manifest_selected_form = false;
    	let manifest_contact_form_list = [false];

    	//
    	let manifest_obj = {};

    	let manifest_index = 0;
    	let man_title = "";
    	let man_cid = "";
    	let man_wrapped_key = "";
    	let man_html = "";
    	let man_max_preference = 1;

    	//
    	let active = "Identify";

    	let first_message = 0;
    	let messages_per_page = 100;
    	let green = false; // an indicator telling if this user ID is set
    	let todays_date = new Date().toLocaleString();

    	let individuals = [
    		{
    			"name": "Hans Solo",
    			"DOB": "1000",
    			"place_of_origin": "alpha centauri",
    			"cool_public_info": "He is a Master Jedi",
    			"business": false,
    			"public_key": true,
    			"cid": "4504385938",
    			"answer_message": ""
    		},
    		{
    			"name": "Max Martin",
    			"DOB": "1000",
    			"place_of_origin": "Fictional Name",
    			"cool_public_info": "He Made a lot of songs",
    			"business": true,
    			"public_key": false,
    			"cid": "4345687685",
    			"answer_message": "I got your songs"
    		},
    		{
    			"name": "Roman Polanski",
    			"DOB": "1000",
    			"place_of_origin": "Warsaw,Poland",
    			"cool_public_info": "He Made Risque Movies",
    			"business": false,
    			"public_key": true,
    			"cid": "9i58w78ew",
    			"answer_message": ""
    		}
    	];

    	let selected;

    	let inbound_solicitation_messages = [
    		{
    			"name": "Darth Vadar",
    			"user_cid": "869968609",
    			"subject": "Hans Solo is Mean",
    			"date": todays_date,
    			"readers": "luke,martha,chewy",
    			"business": false,
    			"public_key": false,
    			"message": "this is a message 4"
    		}
    	];

    	let inbound_contact_messages = [
    		{
    			"name": "Hans Solo",
    			"user_cid": "4504385938",
    			"subject": "Darth Vadier Attacks",
    			"date": todays_date,
    			"readers": "joe,jane,harry",
    			"business": false,
    			"public_key": true,
    			"message": "this is a message 1"
    		},
    		{
    			"name": "Max Martin",
    			"user_cid": "4345687685",
    			"subject": "Adele and Katy Perry Attacks",
    			"date": todays_date,
    			"readers": "Lady Gaga, Taylor Swift, Bruno Mars",
    			"business": false,
    			"public_key": true,
    			"message": "this is a message 2"
    		},
    		{
    			"name": "Roman Polanski",
    			"user_cid": "9i58w78ew",
    			"subject": "Charlie Manson Attacks",
    			"date": todays_date,
    			"readers": "Attorney General, LA DA, Squeeky",
    			"business": true,
    			"public_key": true,
    			"message": "this is a message 3"
    		}
    	];

    	let message_selected = {
    		"name": "Admin",
    		"subject": "Hello From copious.world",
    		"date": today,
    		"readers": "you",
    		"business": false,
    		"public_key": false
    	};

    	/*
          "wrapped_key" : false,
          "encoding" : "uri",
      "when"  ... whereas"date" is a human readable string...
    */
    	let contact_form_links = [
    		{
    			"link": "contact_style_1.html",
    			"html": "some stuff that goes here"
    		},
    		{
    			"link": "contact_style_2.html",
    			"html": `
			<div style="border:solid 1px green; padding: 7px; background-color:lightyellow;text-align:center;" >
				This is a test of showing forms
			</div>`
    		}
    	];

    	let selected_form_link = {
    		"link": "contact_style_1.html",
    		"html": `some stuff that goes here`
    	};

    	function find_contact_from_message(message) {
    		for (let contact of individuals) {
    			if (contact.name == message.name && message.user_cid === contact.cid) {
    				return contact;
    			}
    		}

    		return false;
    	}

    	//
    	// ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    	let window_scale = { "w": 0.4, "h": 0.8 };

    	//
    	window_scale = popup_size();

    	//
    	onMount(async () => {
    		//
    		window.addEventListener("resize", e => {
    			//
    			let scale = popup_size();

    			//
    			$$invalidate(34, window_scale.h = scale.h, window_scale);

    			$$invalidate(34, window_scale.w = scale.w, window_scale);
    		}); //

    		await startup();
    		fetch_messages();
    		fetch_contacts$1();
    		fetch_manifest();

    		// initialize
    		await get_active_users();
    	});

    	// PROFILE  PROFILE  PROFILE  PROFILE  PROFILE  PROFILE  PROFILE 
    	// PROFILE  PROFILE  PROFILE  PROFILE  PROFILE  PROFILE  PROFILE 
    	let g_required_user_fields = [
    		"name",
    		"DOB",
    		"place_of_origin",
    		"cool_public_info",
    		"public_key",
    		"form_link"
    	];

    	let g_renamed_user_fields = {
    		"DOB": "Year of inception",
    		"place_of_origin": "Main Office"
    	};

    	let g_last_inspected_field = false;

    	function check_required_fields(object, required_fields) {
    		g_last_inspected_field = false;

    		for (let field of required_fields) {
    			let value = object[field];
    			g_last_inspected_field = field;
    			if (value === undefined || value.length === 0) return false;
    		}

    		return true;
    	}

    	function missing_fields(activity, app_rename, do_rename) {
    		let l_field = g_last_inspected_field;

    		// 
    		if (do_rename) {
    			let r_field = app_rename[l_field];

    			if (r_field) {
    				l_field = r_field;
    			}
    		}

    		let message = `Missing field: ${l_field},  when ${activity}`;
    		return message;
    	}

    	// ADD PROFILE.....
    	async function add_profile$1() {
    		//
    		let user_data = {
    			name,
    			DOB,
    			place_of_origin,
    			cool_public_info,
    			"business": business === undefined ? false : business,
    			"public_key": false,
    			"form_link": selected_form_link, // a cid to a template ??
    			"answer_message": ""
    		};

    		$$invalidate(15, signup_status = "OK");

    		if (!check_required_fields(user_data, g_required_user_fields)) {
    			$$invalidate(15, signup_status = missing_fields("creating contact page", g_renamed_user_fields, business));
    			return;
    		}

    		await gen_public_key(user_data); // by ref

    		try {
    			$$invalidate(29, green = await add_profile(user_data));
    		} catch(e) {
    			
    		}

    		//
    		await get_active_users();

    		$$invalidate(13, u_index = known_users.length - 1);
    	} //

    	async function get_active_users() {
    		try {
    			let known_user_lists = await window.get_known_users();
    			$$invalidate(4, known_users = known_user_lists[0]);
    			$$invalidate(49, known_identities = known_user_lists[1]);
    		} catch(e) {
    			
    		}
    	}

    	function clear_identify_form() {
    		$$invalidate(2, name = "");
    		$$invalidate(16, DOB = "");
    		$$invalidate(17, place_of_origin = "");
    		$$invalidate(18, cool_public_info = "");
    		$$invalidate(19, business = false);
    		$$invalidate(3, active_user = false);
    		$$invalidate(13, u_index = false);
    		$$invalidate(25, adding_new = true);
    	}

    	async function remove_identify_seen_in_form() {
    		let identity = active_identity;
    		const index = known_users.indexOf(active_user);

    		if (index >= 0) {
    			$$invalidate(4, known_users = [...known_users.slice(0, index), ...known_users.slice(index + 1)]);
    			$$invalidate(13, u_index = Math.min(u_index, known_users.length - 1));
    			await unstore_user(identity);
    		}
    	}

    	function full_message(ev) {
    		if (ev) {
    			let dom_el = ev.target;

    			while (dom_el && dom_el.id.length === 0) {
    				dom_el = dom_el.parentNode;

    				if (dom_el && dom_el.id.length !== 0) {
    					let parts = dom_el.id.split("_");

    					if (parts[0] === "m") {
    						if (parts[1] === "contact") {
    							let index = parseInt(parts[2]);
    							$$invalidate(32, message_selected = inbound_contact_messages[index]);
    						} else {
    							let index = parseInt(parts[2]);
    							$$invalidate(32, message_selected = inbound_solicitation_messages[index]);
    						}

    						break;
    					}
    				}
    			}
    		}

    		let contact = find_contact_from_message(message_selected);

    		if (contact) {
    			contact.answer_message = `&lt;subject ${message_selected.subject}&gt;<br>` + message_selected.message;
    		}

    		start_floating_window(0);
    	}

    	async function fetch_messages() {
    		let identify = active_user;

    		if (identify) {
    			identify.user_info;
    			let all_inbound_messages = await get_message_files(identify, start_of_messages, messages_per_pate);
    			$$invalidate(31, inbound_contact_messages = all_inbound_messages[0]);
    			$$invalidate(30, inbound_solicitation_messages = all_inbound_messages[1]);
    		}
    	}

    	// CONTACTS CONTACTS CONTACTS CONTACTS CONTACTS CONTACTS CONTACTS CONTACTS
    	// CONTACTS CONTACTS CONTACTS CONTACTS CONTACTS CONTACTS CONTACTS CONTACTS
    	function reset_inputs(individual) {
    		$$invalidate(20, c_name = individual ? individual.name : "");
    		$$invalidate(21, c_DOB = individual ? individual.DOB : "");
    		$$invalidate(22, c_place_of_origin = individual ? individual.place_of_origin : "");
    		$$invalidate(23, c_cool_public_info = individual ? individual.cool_public_info : "");
    		$$invalidate(24, c_business = individual ? individual.business : "");
    	}

    	async function add_contact() {
    		let contact = {
    			"name": c_name,
    			"DOB": c_DOB,
    			"place_of_origin": c_place_of_origin,
    			"cool_public_info": c_cool_public_info,
    			"business": c_business,
    			"public_key": c_public_key
    		};

    		$$invalidate(51, individuals = individuals.concat(contact));
    		$$invalidate(11, i = individuals.length - 1);
    		first = "";

    		//
    		let identify = active_user;

    		if (identify) {
    			let update_cid = await update_contacts_to_ipfs(cid, business, individuals);
    			identify.files.contacts = update_cid;
    			update_identity(identify);
    		}
    	} //

    	async function update_contact() {
    		$$invalidate(8, selected.name = c_name, selected);
    		$$invalidate(8, selected.DOB = c_DOB, selected);
    		$$invalidate(8, selected.place_of_origin = c_place_of_origin, selected);
    		$$invalidate(8, selected.cool_public_info = c_cool_public_info, selected);
    		$$invalidate(8, selected.business = c_business, selected);
    		$$invalidate(8, selected.public_key = c_public_key, selected);

    		//
    		let identify = active_user;

    		if (identify) {
    			let update_cid = await update_contacts_to_ipfs(cid, business, individuals);
    			identify.files.contacts = update_cid;
    			update_identity(identify);
    		}
    	} //

    	async function remove_contact() {
    		// Remove selected person from the source array (people), not the filtered array
    		const index = individuals.indexOf(selected);

    		$$invalidate(51, individuals = [...individuals.slice(0, index), ...individuals.slice(index + 1)]);
    		first = last = "";
    		$$invalidate(11, i = Math.min(i, filteredIndviduals.length - 2));

    		//
    		let identify = active_user;

    		if (identify) {
    			let update_cid = await update_contacts_to_ipfs(cid, business, individuals);
    			identify.files.contacts = update_cid;
    			update_identity(identify);
    		}
    	} //

    	async function fetch_contacts$1() {
    		let identify = active_user;

    		if (identify) {
    			let contacts_cid = identify.files.contacts;
    			let user_cid = identify.cid;
    			$$invalidate(51, individuals = await fetch_contacts(contacts_cid, user_cid));
    		}
    	}

    	// MANIFEST MANIFEST MANIFEST MANIFEST MANIFEST MANIFEST MANIFEST MANIFEST MANIFEST 
    	async function man_add_contact_form() {
    		//
    		let a_contact_form = {
    			"title": man_title,
    			"cid": man_cid,
    			"wrapped_key": man_wrapped_key,
    			"html": man_html
    		};

    		//
    		$$invalidate(50, manifest_contact_form_list = manifest_contact_form_list.concat(a_contact_form));

    		$$invalidate(14, manifest_index = manifest_contact_form_list.length - 1);

    		//
    		manifest_obj.custom_contact_forms = manifest_contact_form_list;

    		//
    		let identify = active_user;

    		if (identify) {
    			let update_cid = await update_manifest_to_ipfs(cid, business, manifest_obj);
    			identify.files.contacts = update_cid;
    			update_identity(identify);
    		}
    	} //

    	async function man_update_contact_form() {
    		//
    		$$invalidate(5, manifest_selected_entry.title = man_title, manifest_selected_entry);

    		$$invalidate(5, manifest_selected_entry.cid = man_cid, manifest_selected_entry);
    		$$invalidate(5, manifest_selected_entry.wrapped_key = man_wrapped_key, manifest_selected_entry);
    		$$invalidate(5, manifest_selected_entry.html = man_html, manifest_selected_entry);

    		//
    		let identify = active_user;

    		if (identify) {
    			let update_cid = await update_manifest_to_ipfs(cid, business, manifest_obj);
    			identify.files.contacts = update_cid;
    			update_identity(identify);
    		}
    	} //

    	async function man_remove_contact_form() {
    		// Remove selected person from the source array (people), not the filtered array
    		const index = manifest_contact_form_list.indexOf(manifest_selected_entry);

    		$$invalidate(50, manifest_contact_form_list = [
    			...manifest_contact_form_list.slice(0, index),
    			...manifest_contact_form_list.slice(index + 1)
    		]);

    		$$invalidate(14, manifest_index = Math.min(manifest_index, filtered_manifest_contact_form_list.length - 2));

    		//
    		manifest_obj.custom_contact_forms = manifest_contact_form_list;

    		//
    		let identify = active_user;

    		if (identify) {
    			let update_cid = await update_manifest_to_ipfs(cid, business, manifest_obj);
    			identify.files.contacts = update_cid;
    			update_identity(identify);
    		}
    	} //

    	async function fetch_manifest() {
    		let identify = active_user;

    		if (identify) {
    			let manifest_cid = identify.files.manifest;
    			let user_cid = identify.cid;
    			manifest_obj = await fetch_contacts(manifest_cid, user_cid);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function tabbar_active_binding(value) {
    		active = value;
    		$$invalidate(28, active);
    	}

    	function select_change_handler() {
    		u_index = select_value(this);
    		$$invalidate(13, u_index);
    	}

    	function input0_input_handler() {
    		name = this.value;
    		((($$invalidate(2, name), $$invalidate(3, active_user)), $$invalidate(4, known_users)), $$invalidate(13, u_index));
    	}

    	function input1_change_handler() {
    		business = this.checked;
    		((($$invalidate(19, business), $$invalidate(3, active_user)), $$invalidate(4, known_users)), $$invalidate(13, u_index));
    	}

    	function input_input_handler() {
    		DOB = this.value;
    		((($$invalidate(16, DOB), $$invalidate(3, active_user)), $$invalidate(4, known_users)), $$invalidate(13, u_index));
    	}

    	function input_input_handler_1() {
    		DOB = this.value;
    		((($$invalidate(16, DOB), $$invalidate(3, active_user)), $$invalidate(4, known_users)), $$invalidate(13, u_index));
    	}

    	function input_input_handler_2() {
    		place_of_origin = this.value;
    		((($$invalidate(17, place_of_origin), $$invalidate(3, active_user)), $$invalidate(4, known_users)), $$invalidate(13, u_index));
    	}

    	function input_input_handler_3() {
    		place_of_origin = this.value;
    		((($$invalidate(17, place_of_origin), $$invalidate(3, active_user)), $$invalidate(4, known_users)), $$invalidate(13, u_index));
    	}

    	function textarea_input_handler() {
    		cool_public_info = this.value;
    		((($$invalidate(18, cool_public_info), $$invalidate(3, active_user)), $$invalidate(4, known_users)), $$invalidate(13, u_index));
    	}

    	function select_change_handler_1() {
    		form_index = select_value(this);
    		$$invalidate(12, form_index);
    	}

    	function input0_input_handler_1() {
    		prefix = this.value;
    		$$invalidate(0, prefix);
    	}

    	function select_change_handler_2() {
    		i = select_value(this);
    		$$invalidate(11, i);
    	}

    	function input1_input_handler() {
    		c_name = this.value;
    		$$invalidate(20, c_name);
    	}

    	function input2_change_handler() {
    		c_business = this.checked;
    		$$invalidate(24, c_business);
    	}

    	function input_input_handler_4() {
    		c_DOB = this.value;
    		$$invalidate(21, c_DOB);
    	}

    	function input_input_handler_5() {
    		c_DOB = this.value;
    		$$invalidate(21, c_DOB);
    	}

    	function input_input_handler_6() {
    		c_place_of_origin = this.value;
    		$$invalidate(22, c_place_of_origin);
    	}

    	function input_input_handler_7() {
    		c_place_of_origin = this.value;
    		$$invalidate(22, c_place_of_origin);
    	}

    	function textarea_input_handler_1() {
    		c_cool_public_info = this.value;
    		$$invalidate(23, c_cool_public_info);
    	}

    	function input0_input_handler_2() {
    		man_prefix = this.value;
    		$$invalidate(1, man_prefix);
    	}

    	function select_change_handler_3() {
    		manifest_index = select_value(this);
    		$$invalidate(14, manifest_index);
    	}

    	function input1_input_handler_1() {
    		man_title = this.value;
    		$$invalidate(27, man_title);
    	}

    	function input2_input_handler() {
    		man_max_preference = this.value;
    		$$invalidate(7, man_max_preference);
    	}

    	function input3_input_handler() {
    		man_cid = this.value;
    		$$invalidate(6, man_cid);
    	}

    	$$self.$capture_state = () => ({
    		Tab,
    		Label: CommonLabel,
    		TabBar,
    		onMount,
    		FloatWindow,
    		MessageDisplay,
    		MessageEditor,
    		ipfs_profiles,
    		cid,
    		signup_status,
    		start_of_messages,
    		messages_per_pate,
    		prefix,
    		man_prefix,
    		i,
    		c_i,
    		i_i,
    		form_index,
    		name,
    		DOB,
    		place_of_origin,
    		cool_public_info,
    		business,
    		c_name,
    		c_DOB,
    		c_place_of_origin,
    		c_cool_public_info,
    		c_business,
    		today,
    		active_user,
    		active_identity,
    		known_users,
    		known_identities,
    		u_index,
    		adding_new,
    		manifest_selected_entry,
    		manifest_selected_form,
    		manifest_contact_form_list,
    		manifest_obj,
    		manifest_index,
    		man_title,
    		man_cid,
    		man_wrapped_key,
    		man_html,
    		man_max_preference,
    		active,
    		first_message,
    		messages_per_page,
    		green,
    		todays_date,
    		individuals,
    		selected,
    		inbound_solicitation_messages,
    		inbound_contact_messages,
    		message_selected,
    		contact_form_links,
    		selected_form_link,
    		find_contact_from_message,
    		window_scale,
    		popup_size,
    		g_required_user_fields,
    		g_renamed_user_fields,
    		g_last_inspected_field,
    		check_required_fields,
    		missing_fields,
    		add_profile: add_profile$1,
    		get_active_users,
    		clear_identify_form,
    		remove_identify_seen_in_form,
    		pop_editor,
    		show_subject,
    		full_message,
    		fetch_messages,
    		reset_inputs,
    		add_contact,
    		update_contact,
    		remove_contact,
    		fetch_contacts: fetch_contacts$1,
    		preview_contact_form,
    		man_add_contact_form,
    		man_update_contact_form,
    		man_remove_contact_form,
    		fetch_manifest,
    		filteredIndviduals,
    		filtered_manifest_contact_form_list
    	});

    	$$self.$inject_state = $$props => {
    		if ("cid" in $$props) cid = $$props.cid;
    		if ("signup_status" in $$props) $$invalidate(15, signup_status = $$props.signup_status);
    		if ("start_of_messages" in $$props) start_of_messages = $$props.start_of_messages;
    		if ("messages_per_pate" in $$props) messages_per_pate = $$props.messages_per_pate;
    		if ("prefix" in $$props) $$invalidate(0, prefix = $$props.prefix);
    		if ("man_prefix" in $$props) $$invalidate(1, man_prefix = $$props.man_prefix);
    		if ("i" in $$props) $$invalidate(11, i = $$props.i);
    		if ("c_i" in $$props) $$invalidate(46, c_i = $$props.c_i);
    		if ("i_i" in $$props) $$invalidate(47, i_i = $$props.i_i);
    		if ("form_index" in $$props) $$invalidate(12, form_index = $$props.form_index);
    		if ("name" in $$props) $$invalidate(2, name = $$props.name);
    		if ("DOB" in $$props) $$invalidate(16, DOB = $$props.DOB);
    		if ("place_of_origin" in $$props) $$invalidate(17, place_of_origin = $$props.place_of_origin);
    		if ("cool_public_info" in $$props) $$invalidate(18, cool_public_info = $$props.cool_public_info);
    		if ("business" in $$props) $$invalidate(19, business = $$props.business);
    		if ("c_name" in $$props) $$invalidate(20, c_name = $$props.c_name);
    		if ("c_DOB" in $$props) $$invalidate(21, c_DOB = $$props.c_DOB);
    		if ("c_place_of_origin" in $$props) $$invalidate(22, c_place_of_origin = $$props.c_place_of_origin);
    		if ("c_cool_public_info" in $$props) $$invalidate(23, c_cool_public_info = $$props.c_cool_public_info);
    		if ("c_business" in $$props) $$invalidate(24, c_business = $$props.c_business);
    		if ("today" in $$props) today = $$props.today;
    		if ("active_user" in $$props) $$invalidate(3, active_user = $$props.active_user);
    		if ("active_identity" in $$props) $$invalidate(48, active_identity = $$props.active_identity);
    		if ("known_users" in $$props) $$invalidate(4, known_users = $$props.known_users);
    		if ("known_identities" in $$props) $$invalidate(49, known_identities = $$props.known_identities);
    		if ("u_index" in $$props) $$invalidate(13, u_index = $$props.u_index);
    		if ("adding_new" in $$props) $$invalidate(25, adding_new = $$props.adding_new);
    		if ("manifest_selected_entry" in $$props) $$invalidate(5, manifest_selected_entry = $$props.manifest_selected_entry);
    		if ("manifest_selected_form" in $$props) $$invalidate(26, manifest_selected_form = $$props.manifest_selected_form);
    		if ("manifest_contact_form_list" in $$props) $$invalidate(50, manifest_contact_form_list = $$props.manifest_contact_form_list);
    		if ("manifest_obj" in $$props) manifest_obj = $$props.manifest_obj;
    		if ("manifest_index" in $$props) $$invalidate(14, manifest_index = $$props.manifest_index);
    		if ("man_title" in $$props) $$invalidate(27, man_title = $$props.man_title);
    		if ("man_cid" in $$props) $$invalidate(6, man_cid = $$props.man_cid);
    		if ("man_wrapped_key" in $$props) man_wrapped_key = $$props.man_wrapped_key;
    		if ("man_html" in $$props) man_html = $$props.man_html;
    		if ("man_max_preference" in $$props) $$invalidate(7, man_max_preference = $$props.man_max_preference);
    		if ("active" in $$props) $$invalidate(28, active = $$props.active);
    		if ("first_message" in $$props) first_message = $$props.first_message;
    		if ("messages_per_page" in $$props) messages_per_page = $$props.messages_per_page;
    		if ("green" in $$props) $$invalidate(29, green = $$props.green);
    		if ("todays_date" in $$props) todays_date = $$props.todays_date;
    		if ("individuals" in $$props) $$invalidate(51, individuals = $$props.individuals);
    		if ("selected" in $$props) $$invalidate(8, selected = $$props.selected);
    		if ("inbound_solicitation_messages" in $$props) $$invalidate(30, inbound_solicitation_messages = $$props.inbound_solicitation_messages);
    		if ("inbound_contact_messages" in $$props) $$invalidate(31, inbound_contact_messages = $$props.inbound_contact_messages);
    		if ("message_selected" in $$props) $$invalidate(32, message_selected = $$props.message_selected);
    		if ("contact_form_links" in $$props) $$invalidate(35, contact_form_links = $$props.contact_form_links);
    		if ("selected_form_link" in $$props) $$invalidate(33, selected_form_link = $$props.selected_form_link);
    		if ("window_scale" in $$props) $$invalidate(34, window_scale = $$props.window_scale);
    		if ("g_required_user_fields" in $$props) g_required_user_fields = $$props.g_required_user_fields;
    		if ("g_renamed_user_fields" in $$props) g_renamed_user_fields = $$props.g_renamed_user_fields;
    		if ("g_last_inspected_field" in $$props) g_last_inspected_field = $$props.g_last_inspected_field;
    		if ("filteredIndviduals" in $$props) $$invalidate(9, filteredIndviduals = $$props.filteredIndviduals);
    		if ("filtered_manifest_contact_form_list" in $$props) $$invalidate(10, filtered_manifest_contact_form_list = $$props.filtered_manifest_contact_form_list);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*prefix*/ 1 | $$self.$$.dirty[1] & /*individuals*/ 1048576) {
    			// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    			$$invalidate(9, filteredIndviduals = prefix
    			? individuals.filter(individual => {
    					const name = `${individual.name}`;
    					return name.toLowerCase().startsWith(prefix.toLowerCase());
    				})
    			: individuals);
    		}

    		if ($$self.$$.dirty[0] & /*filteredIndviduals, i*/ 2560) {
    			$$invalidate(8, selected = filteredIndviduals[i]);
    		}

    		if ($$self.$$.dirty[0] & /*selected*/ 256) {
    			reset_inputs(selected);
    		}

    		if ($$self.$$.dirty[0] & /*form_index*/ 4096) {
    			// 
    			$$invalidate(33, selected_form_link = contact_form_links[form_index]);
    		}

    		if ($$self.$$.dirty[0] & /*known_users, u_index*/ 8208) {
    			//
    			$$invalidate(3, active_user = known_users[u_index]);
    		}

    		if ($$self.$$.dirty[0] & /*u_index*/ 8192 | $$self.$$.dirty[1] & /*known_identities*/ 262144) {
    			$$invalidate(48, active_identity = known_identities[u_index]);
    		}

    		if ($$self.$$.dirty[1] & /*active_identity*/ 131072) {
    			$$invalidate(29, green = active_identity
    			? active_identity.stored_externally
    			: false);
    		}

    		if ($$self.$$.dirty[0] & /*active_user*/ 8) {
    			{
    				if (active_user !== undefined && active_user) {
    					$$invalidate(2, name = active_user.name);
    					$$invalidate(16, DOB = active_user.DOB);
    					$$invalidate(17, place_of_origin = active_user.place_of_origin);
    					$$invalidate(18, cool_public_info = active_user.cool_public_info);
    					$$invalidate(19, business = active_user.business);
    					$$invalidate(25, adding_new = false);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*man_prefix*/ 2 | $$self.$$.dirty[1] & /*manifest_contact_form_list*/ 524288) {
    			$$invalidate(10, filtered_manifest_contact_form_list = man_prefix
    			? manifest_contact_form_list.filter(man_contact => {
    					const name = `${man_contact.name}`;
    					return name.toLowerCase().startsWith(man_prefix.toLowerCase());
    				})
    			: manifest_contact_form_list);
    		}

    		if ($$self.$$.dirty[0] & /*filtered_manifest_contact_form_list, manifest_index, manifest_selected_entry, man_cid, man_max_preference*/ 17632 | $$self.$$.dirty[1] & /*manifest_contact_form_list*/ 524288) {
    			{
    				$$invalidate(5, manifest_selected_entry = filtered_manifest_contact_form_list[manifest_index]);

    				if (manifest_selected_entry !== undefined) {
    					$$invalidate(26, manifest_selected_form = manifest_selected_entry.html);
    				}

    				manifest_obj = {
    					"default_contact_form": man_cid, // a template CID (composition done at the interface),
    					"custom_contact_forms": manifest_contact_form_list,
    					"max_preference": man_max_preference
    				};
    			}
    		}
    	};

    	return [
    		prefix,
    		man_prefix,
    		name,
    		active_user,
    		known_users,
    		manifest_selected_entry,
    		man_cid,
    		man_max_preference,
    		selected,
    		filteredIndviduals,
    		filtered_manifest_contact_form_list,
    		i,
    		form_index,
    		u_index,
    		manifest_index,
    		signup_status,
    		DOB,
    		place_of_origin,
    		cool_public_info,
    		business,
    		c_name,
    		c_DOB,
    		c_place_of_origin,
    		c_cool_public_info,
    		c_business,
    		adding_new,
    		manifest_selected_form,
    		man_title,
    		active,
    		green,
    		inbound_solicitation_messages,
    		inbound_contact_messages,
    		message_selected,
    		selected_form_link,
    		window_scale,
    		contact_form_links,
    		add_profile$1,
    		clear_identify_form,
    		remove_identify_seen_in_form,
    		full_message,
    		add_contact,
    		update_contact,
    		remove_contact,
    		man_add_contact_form,
    		man_update_contact_form,
    		man_remove_contact_form,
    		c_i,
    		i_i,
    		active_identity,
    		known_identities,
    		manifest_contact_form_list,
    		individuals,
    		tabbar_active_binding,
    		select_change_handler,
    		input0_input_handler,
    		input1_change_handler,
    		input_input_handler,
    		input_input_handler_1,
    		input_input_handler_2,
    		input_input_handler_3,
    		textarea_input_handler,
    		select_change_handler_1,
    		input0_input_handler_1,
    		select_change_handler_2,
    		input1_input_handler,
    		input2_change_handler,
    		input_input_handler_4,
    		input_input_handler_5,
    		input_input_handler_6,
    		input_input_handler_7,
    		textarea_input_handler_1,
    		input0_input_handler_2,
    		select_change_handler_3,
    		input1_input_handler_1,
    		input2_input_handler,
    		input3_input_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {}, [-1, -1, -1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.getElementById('app-main'),
    	props: {
    		name: 'My Blog With Grid'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
