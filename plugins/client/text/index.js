import React, { Component, Fragment } from "react";
import { i18next } from "/client/api";
import ErrorsBlock from "@reactioncommerce/components/ErrorsBlock/v1";
import Field from "@reactioncommerce/components/Field/v1";
import TextInput from "@reactioncommerce/components/TextInput/v1";
import withStyles from "./withStyles";
import { Grid } from "@material-ui/core";
import constructor from "/plugins/client/utils/index.js";

export class Text extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    constructor(this, props);
  }
  renderContent = () => {
    const { name, names, form, defaultValue, components: { Input = TextInput } = {}, inputProps } = this.props;
    return (
      <Fragment>
        <Input
          value={this.value({ def: defaultValue })}
          id={this.id}
          name={name}
          onChange={this.onChange}
          {...inputProps}
        />
        <ErrorsBlock
          errors={form && form.current && form.current.getFirstErrorMessage(names || [name])}
          names={names || [name]}
        />
      </Fragment>
    );
  };
  renderField = () => {
    const { name, label, i18nLabel, i18nDdef } = this.props;
    if (label === null) return this.renderContent();
    return (
      <Field name={name} label={this.label} labelFor={this.id}>
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
