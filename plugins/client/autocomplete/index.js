import React, { Component } from "react";
import lodash from "lodash";
import { i18next } from "/client/api";
import Field from "@reactioncommerce/components/Field/v1";
import SelectMulti from "@reactioncommerce/catalyst/Select";
import withStyles from "./withStyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import constructor from "/plugins/client/utils/index.js";
import Statics from "/plugins/client/utils/statics.js";

export class AutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = { statics: new Statics(props) };
    constructor(this, props);
  }
  _missing = (v) => ({ value: v, label: v, _missing: true });
  get defOptions() {
    return [];
    // options={this.props.statics.list(name, this)}
  }
  get options() {
    const res = this.props.options || this.defOptions;
    const val = this.value();
    if (val) {
      (Array.isArray(val) ? val : [val]).forEach((v) => {
        if (!res.find((f) => f.value === v)) {
          res.push(this._missing(v));
        }
      });
    }
    return res;
  }
  _search = (val) => {
    let found = this.options.find((f) => f.value === val);
    if (!found) {
      found = this._missing(val);
      console.error(`\n\n==> { Error: Missing }\n`, found, `\n`, ``);
    }
    return found;
  };

  get getValue() {
    if (this.props.isMulti !== false) {
      return this.value({ def: [] })
        .map(this._search)
        .filter((h) => h);
    }
    const val = this.value({ def: null });
    if (val) return this._search(val);
  }
  renderSelect = () => {
    const {
      withLabel,
      name,
      id,
      uniqId,
      i18nDef,
      i18nLabel,
      i18n,
      classes,
      options,
      onNew,
      onSelection,
      isMulti = true,
      ...more
    } = this.props;

    return (
      <SelectMulti
        isMulti={isMulti}
        name={name}
        id={this.id}
        isAsync={!!onNew}
        options={this.options}
        loadOptions={(writing) => {
          return new Promise((resolver) => {
            if (onNew && (writing || "").trim() !== "") {
              return resolver(
                this.options.concat([
                  {
                    value: writing.trim(),
                    label: (
                      <span>
                        <FontAwesomeIcon color="red" icon={faPlus} /> <b>{lodash.capitalize(writing.trim())}</b>
                      </span>
                    ),
                    _new: true,
                  },
                ])
              );
            }
            resolver(this.options);
          });
        }}
        onSelection={(chosen) => {
          if (isMulti) {
            // new
            if (onNew && chosen) {
              const news = chosen.filter((c) => c._new);
              if (news.length) {
                const nres = onNew(news, chosen);
                if (nres) chosen = nres;
              }
            }
            // select
            if (onSelection) onSelection((chosen || []).map((o) => ({ ...o, label: o._new ? o.value : o.label })));
            // value
            this.setValue({ value: (chosen || []).map((o) => o.value) });
          } else {
            if (onNew && (chosen || {})._new) {
              const nres = onNew(chosen, chosen);
              if (nres) chosen = nres;
            }
            // select
            if (onSelection) onSelection(chosen);
            // value
            this.setValue(chosen);
          }
        }}
        value={this.getValue}
        {...more}
      />
    );
  };

  render() {
    const { withLabel = true, name, i18nDef, i18nLabel, i18n } = this.props;
    return withLabel ? (
      <Field name={name} label={i18n || i18next.t(i18nLabel || `admin.form.${name}`, i18nDef)} labelFor={this.id}>
        {this.renderSelect()}
      </Field>
    ) : (
      this.renderSelect()
    );
  }
}
export default withStyles(AutoComplete);