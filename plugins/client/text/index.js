import React, { Component, Fragment } from "react";
import ErrorsBlock from "@reactioncommerce/components/ErrorsBlock/v1";
import Field from "@reactioncommerce/components/Field/v1";
import TextInput from "@reactioncommerce/components/TextInput/v1";
import withStyles from "./withStyles";
import { Grid } from "@material-ui/core";
// import lodash from "lodash";
// import muiOptionsDef from "reacto-form/esm/muiOptions";
import constructor from "/plugins/client/utils/index.js";

export class Text extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    constructor(this, props);
  }
  // uniqId = lodash.uniqueId("Text");
  // get id() {
  //   return this.props.id || `${this.props.name}_${this.props.uniqId || this.uniqId}`;
  // }
  // get inputPorps() {
  //   const { name, getInputProps, muiOptions = muiOptionsDef } = this.props;
  //   return getInputProps ? getInputProps(name, muiOptions) : { value: undefined, onChange: () => {} };
  // }
  // get value() {
  //   const { name, getInputProps, value, form } = this.props;
  //   if (value !== undefined) return value;
  //   if (getInputProps) return this.inputPorps.value;
  //   if (form) return lodash.get(form.value, name);
  // }
  // onChange = (ev) => {
  //   const { name, onChange, form, getInputProps } = this.props;
  //   const event = ev && typeof ev === "object" && ev.target ? ev : { target: { value: ev } };
  //   if (getInputProps) this.inputPorps.onChange(event, this);
  //   if (form) {
  //     try {
  //       form.setState({ value: lodash.set({ ...form.state.value }, name, event.target.value) });
  //     } catch (error) {
  //       console.error(`ERROR: onChange for name: ${name}`, error, `\n`);
  //     }
  //   }
  //   if (onChange) onChange(event, this);
  // };
  renderContent = () => {
    const { name, names, form, components: { Input = TextInput } = {}, inputProps } = this.props;
    return (
      <Fragment>
        <Input value={this.value()} id={this.id} name={name} onChange={this.onChange} {...inputProps} />
        <ErrorsBlock
          errors={form && form.current && form.current.getFirstErrorMessage(names || [name])}
          names={names || [name]}
        />
      </Fragment>
    );
  };
  renderField = () => {
    const { name, label } = this.props;
    if (label === null) return this.renderContent();
    return (
      <Field name={name} label={label} labelFor={this.id}>
        {this.renderContent()}
      </Field>
    );
  };
  render() {
    const { xs = 6 } = this.props;
    if (xs === null) return this.renderField();
    return (
      <Grid item xs={xs}>
        {this.renderField()}
      </Grid>
    );
  }
}
export default withStyles(Text);
// import useReactoForm from "reacto-form/esm/useReactoForm";
// import TextField from "@material-ui/core/TextField";
// export default function (props) {
//   const {   getInputProps } = useReactoForm(props);
//   const { xs = 6, name, names, label, uniqId, components: { TextInput = TextInp } = {}, ...more } = props;
//   const getId = props.id || `${props.name}_${props.uniqId}`;
//   return (
//     <Grid item xs={xs}>
//       <Field name={name} label={name} labelFor={getId}>
//         HelloX
//         <TextInput id={getId} name={name}  />
//         <ErrorsBlock names={names || [name]} />
//       </Field>
//     </Grid>
//   );
// }
