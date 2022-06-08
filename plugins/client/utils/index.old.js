import muiOptionsDef from "reacto-form/esm/muiOptions";
import lodash from "lodash";
export default function utils(component, props, name) {
  // Id
  if (!component.id)
    Object.defineProperty(component, "id", {
      get: function () {
        return props.id || `${component.name || props.name}_${props.uniqId || component.uniqId}`;
      },
    });
  // name
  if (!component.name)
    Object.defineProperty(component, "name", {
      get: function () {
        return props.name || name;
      },
    });
  //uniqId
  component.uniqId = component.uniqId || lodash.uniqueId(component.name);
  // onForm
  if (!component.onForm)
    component.onForm = (callback) => {
      return props.onForm ? props.onForm(callback) : callback(props.form);
    };
  // muiOptions
  if (!component.muiOptions)
    component.muiOptions = (muiOptions) => {
      return muiOptions || props.muiOptions || muiOptionsDef;
    };
  // inputPorps
  if (!component.inputPorps)
    component.inputPorps = ({ getInputProps, name, muiOptions } = {}) => {
      return getInputProps || props.getInputProps
        ? (getInputProps || props.getInputProps)(name || component.name || props.name, component.muiOptions(muiOptions))
        : null;
    };
  // Value
  if (!component.value)
    component.value = (opts = {}) => {
      if (props.value !== undefined) return props.value || opts.def;
      opts.name = opts.name || component.name;
      if (component.inputPorps()) {
        return component.inputPorps(opts).value;
      }
      if (props.form) return lodash.get(props.form.state.value, opts.name);
      return component.onForm((form) => (form && lodash.get(form.state.value, opts.name)) || opts.def);
    };
  // SetValue
  if (!component.setValue)
    component.setValue = (opts = {}) => {
      opts.name = opts.name || component.name;
      try {
        if (component.inputPorps()) {
          component.inputPorps(opts).onChange({ target: opts });
        } else {
          if (props.form) {
            props.form.setState({ value: lodash.set({ ...props.form.state.value }, opts.name, opts.value) });
          } else if (component.onForm) {
            component.onForm((form) => {
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
}
