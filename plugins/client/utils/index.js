import muiOptionsDef from "reacto-form/esm/muiOptions";
import { i18next } from "/client/api";
import lodash from "lodash";
import Statics from "/plugins/client/utils/statics.js";
export default function utils(component, props, name) {
  //  statics
  if (!component.statics) component.statics = props.statics || new Statics(props);
  // name
  if (!component.name)
    Object.defineProperty(component, "name", {
      get: function () {
        return props.name || `${props.path || ""}${name}`;
      },
    });
  // label
  if (!component.label)
    Object.defineProperty(component, "label", {
      get: function () {
        return (
          props.label ||
          i18next.t(
            props.i18nLabel ||
              `admin.${
                (component.name || "")
                  .replace(/\.(inp|out)$/, "")
                  .split(".")
                  .splice(-1)[0]
              }`,
            props.i18nDef || "..."
          )
        );
      },
    });
  // muiOptions
  if (!component.muiOptions)
    component.muiOptions = (muiOptions) => {
      return muiOptions || props.muiOptions || muiOptionsDef;
    };
  // inputPorps
  if (!component.inputPorps)
    component.inputPorps = (opts = {}) => {
      const { getInputProps, name, muiOptions } = { ...props, ...opts };
      return getInputProps ? getInputProps(name || component.name, component.muiOptions(muiOptions)) : null;
    };
  //uniqId
  component.uniqId = component.uniqId || lodash.uniqueId(component.name);
  // Id
  if (!component.id)
    Object.defineProperty(component, "id", {
      get: function () {
        return (
          props.id ||
          (component.inputPorps()
            ? component.inputPorps().id
            : `${component.name || props.name}_${props.uniqId || component.uniqId}`)
        );
      },
    });
  // onReady
  if (!component.onReady)
    component.onReady = (callback) => {
      return props.onReady
        ? props.onReady((form) => callback(component, form || props.form))
        : callback(component, props.form);
    };
  // component.onReady = (callback) => {
  //   return props.onReady ? props.onReady(callback) : callback(props.form);
  // };
  // Value
  if (!component.value)
    component.value = (opts = {}) => {
      let val = props.value;
      if (props.value === undefined) {
        opts.name = opts.name || component.name;
        if (props.formx) {
          if (opts.name.match("\\.")) {
            val = lodash.get(props.formx.value, opts.name);
          } else {
            val = props.formx.value;
          }
        } else if (component.inputPorps()) {
          val = component.inputPorps(opts).value;
        } else if (props.form) {
          val = lodash.get(props.form.state.value, opts.name);
        } else {
          val = component.onReady((_, form) => form && lodash.get(form.state.value, opts.name));
        }
      }
      val = val || opts.def;
      if (val === null && opts.nullable !== false) return;
      return val;
    };
  // component.value = (opts = {}) => {
  //   if (props.value !== undefined) return props.value || opts.def;
  //   opts.name = opts.name || component.name;
  //   if (component.inputPorps()) {
  //     return component.inputPorps(opts).value;
  //   }
  //   if (props.form) return lodash.get(props.form.state.value, opts.name);
  //   return component.onReady((form) => (form && lodash.get(form.state.value, opts.name)) || opts.def);
  // };
  // SetValue
  if (!component.setValue)
    component.setValue = (opts = {}) => {
      opts.name = opts.name || component.name;
      try {
        if (props.formx) {
          if (opts.name.match("\\.")) {
            lodash.set(props.formx.value, opts.name, opts.value);
          } else {
            props.formx.onChange({ target: opts.value });
            props.formx.value = opts.value;
          }
          console.info(`\n\n==> { FormYX }\n`, !!opts.name.match("\\."), opts.value, props.formx.value,`\n`, ``);
        } else if (component.inputPorps()) {
          component.inputPorps(opts).onChange({ target: opts });
          console.info(`\n\n==> { opts }\n`, opts, component.inputPorps(opts).value, `\n`, ``);
          try {
            if (component.setState) component.setState({});
          } catch (error) {
            console.info(`\n\n==> { setValue }\n`, error, `\n`, ``);
          }
        } else {
          if (props.form) {
            props.form.setState({ value: lodash.set({ ...props.form.state.value }, opts.name, opts.value) });
          } else if (component.onReady) {
            component.onReady((_, form) => {
              if (form) form.setState({ value: lodash.set({ ...form.state.value }, opts.name, opts.value) });
            });
          }
        }
      } catch (error) {
        console.error(`ERROR: onChange for name: ${name}`, error, `\n`);
      }
      if (opts.onChange) opts.onChange({ target: opts }, this);
      return opts;
    };
  // component.setValue = (opts = {}) => {
  //   opts.name = opts.name || component.name;
  //   try {
  //     if (component.inputPorps()) {
  //       component.inputPorps(opts).onChange({ target: opts });
  //     } else {
  //       if (props.form) {
  //         props.form.setState({ value: lodash.set({ ...props.form.state.value }, opts.name, opts.value) });
  //       } else if (component.onReady) {
  //         component.onReady((form) => {
  //           if (form) form.setState({ value: lodash.set({ ...form.state.value }, opts.name, opts.value) });
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     console.error(`ERROR: onChange for name: ${name}`, error, `\n`);
  //   }
  //   if (opts.onChange) opts.onChange({ target: opts }, this);
  //   return opts;
  // };
  // onUpdate
  if (!component.onUpdate)
    component.onUpdate = ({ callback, ...opts } = {}) => {
      return component.setValue({ ...opts, value: callback(component.value(opts)) });
    };
  // onChange
  if (!component.onChange)
    component.onChange = (ev) => {
      const event = ev && typeof ev === "object" && ev.target ? ev : { target: { value: ev } };
      return component.setValue({ value: event.target.value, ...props });
    };
  // onPush
  if (!component.onPush)
    component.onPush = (list = [], def) => {
      component.onUpdate({
        def: [],
        callback: (main) => {
          let res = main && Array.isArray(main) ? [...main] : [];
          console.info(`\n\n==> { onPush }\n`, res, `\n`, ``);
          if ((list || []).length) {
            let rest = res;
            let index = 0;
            for (const [parentIndex, search] of list) {
              if (rest[parentIndex]) {
                if (!rest[parentIndex][search]) {
                  rest[parentIndex][search] = [];
                  rest[parentIndex][search].push(def || {});
                } else if (index + 1 === list.length) {
                  rest[parentIndex][search].push(def || {});
                }
                rest = rest[parentIndex];
              } else {
                console.error("onPush:not found", { parentIndex, search }, list);
                break;
              }
              index++;
            }
          } else {
            res.push(def || {});
          }
          return res;
        },
      });
    };
  // onUnPush
  if (!component.onUnPush)
    component.onUnPush = (indexOrList) => {
      component.onUpdate({
        def: [],
        callback: (main) => {
          let res = main && Array.isArray(main) ? [...main] : [];
          if (typeof indexOrList === "number") {
            res.splice(indexOrList, 1);
          } else if (indexOrList.length) {
            let rest = res;
            let index = 0;
            for (const req of indexOrList) {
              if (typeof req === "number") {
                rest.splice(req, 1);
              } else {
                const [parentIndex, search] = req;
                if (rest[parentIndex]) {
                  if (!rest[parentIndex][search]) {
                    console.error("onUnPush:not found", { parentIndex, search }, list);
                    break;
                  }
                  rest = rest[parentIndex];
                } else {
                  console.error("onUnPush:not found", { parentIndex, search }, list);
                  break;
                }
              }
              index++;
            }
          }
          return res;
        },
      });
    };
}
