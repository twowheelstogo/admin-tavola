import React, { Component } from "react";
import PropTypes from "prop-types";
import { uniqueId, upperFirst } from "lodash";
import { Form } from "reacto-form";
import { i18next } from "/client/api";
import Button from "@reactioncommerce/catalyst/Button";
import Checkbox from "@reactioncommerce/components/Checkbox/v1";
import ErrorsBlock from "@reactioncommerce/components/ErrorsBlock/v1";
import Field from "@reactioncommerce/components/Field/v1";
import Select from "@reactioncommerce/components/Select/v1";
import TextInput from "@reactioncommerce/components/TextInput/v1";
import Autocomplete from "/plugins/client/autocomplete/index.js";
import { Divider } from "@material-ui/core";
import ShippingDestination from "/plugins/shipping/destinations/client/form.js";
import ShippingApiDistance from "/plugins/shipping/destinations/client/api.js";

Checkbox.isFormInput = true;
export default class ShippingMethodForm extends Component {
  static propTypes = {
    groupOptions: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string,
      })
    ),
    isEditing: PropTypes.bool,
    methodDoc: PropTypes.object,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    validator: PropTypes.func,
    classes: PropTypes.object,
  };

  static defaultProps = {
    isEditing: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      form: {},
    };
  }

  uniqueInstanceIdentifier = uniqueId("ShippingMethodForm");
  handleSave = () => {
    if (this.form) {
      this.form.submit();
    }
  };

  render() {
    const { groupOptions, isEditing, isSaving, methodDoc, onCancel, onDelete, onSubmit, validator, classes } =
      this.props;

    const nameInputId = `name_${this.uniqueInstanceIdentifier}`;
    const labelInputId = `label_${this.uniqueInstanceIdentifier}`;
    const groupInputId = `group_${this.uniqueInstanceIdentifier}`;
    const costInputId = `cost_${this.uniqueInstanceIdentifier}`;
    const handlingInputId = `handling_${this.uniqueInstanceIdentifier}`;
    const rateInputId = `rate_${this.uniqueInstanceIdentifier}`;
    const positionInputId = `position_${this.uniqueInstanceIdentifier}`;
    // const langsInputId = `langs_${this.uniqueInstanceIdentifier}`;
    return (
      <div className="clearfix">
        <Form
          ref={(form) => {
            this.form = form;
          }}
          onSubmit={(form, e) => onSubmit({ ...this.state.form, ...form }, e)}
          validator={validator}
          value={methodDoc}
        >
          <Field name="name" label={i18next.t("shippingMethod.name")} labelFor={nameInputId}>
            <TextInput id={nameInputId} name="name" />
            <ErrorsBlock names={["name"]} />
          </Field>
          <Field name="label" label={i18next.t("shippingMethod.label")} labelFor={labelInputId}>
            <TextInput id={labelInputId} name="label" />
            <ErrorsBlock names={["label"]} />
          </Field>
          <Field name="group" label={i18next.t("shippingMethod.group")} labelFor={groupInputId}>
            <Select id={groupInputId} name="group" options={groupOptions} />
            <ErrorsBlock names={["group"]} />
          </Field>
          <Field name="cost" label={i18next.t("shippingMethod.cost")} labelFor={costInputId}>
            <TextInput id={costInputId} name="cost" />
            <ErrorsBlock names={["cost"]} />
          </Field>
          <Field name="handling" label={i18next.t("shippingMethod.handling")} labelFor={handlingInputId}>
            <TextInput id={handlingInputId} name="handling" />
            <ErrorsBlock names={["handling"]} />
          </Field>
          <Field name="rate" label={i18next.t("shippingMethod.rate")} labelFor={rateInputId}>
            <TextInput id={rateInputId} name="rate" />
            <ErrorsBlock names={["rate"]} />
          </Field>
          <Field name="position" label={i18next.t("shippingMethod.position", "Position")} labelFor={positionInputId}>
            <TextInput id={positionInputId} name="position" />
            <ErrorsBlock names={["position"]} />
          </Field>
          <Autocomplete
            allowedNew={false}
            uniqId={this.uniqueInstanceIdentifier}
            form={this.form}
            onReady={(callback) => callback(this.form)}
            {...this.props}
            name="fulfillmentTypes"
            i18nLabel={i18next.t("productDetailEdit.fulfillmentTypes", "FulfillmentTypes")}
            i18nDef="fulfillmentTypes"
            list={["shipping", "pickup", "digital"]}
          />
          <ShippingDestination
            uniqId={this.uniqueInstanceIdentifier}
            form={this.form}
            onReady={(callback) => callback(this.form)}
            {...this.props}
          />
          <ShippingApiDistance
            uniqId={this.uniqueInstanceIdentifier}
            form={this.form}
            onReady={(callback) => callback(this.form)}
            {...this.props}
          />
          <Field name="isEnabled">
            <Checkbox name="isEnabled" label={i18next.t("shippingMethod.enabled")} />
            <ErrorsBlock names={["isEnabled"]} />
          </Field>
        </Form>
        <div className="clearfix">
          <Divider style={{ margin: "20px 0" }} />
          <div className="pull-right" style={{ display: "flex" }}>
            <Button variant="outlined" onClick={onCancel}>
              {i18next.t("app.cancel")}
            </Button>
            {isEditing && (
              <div style={{ marginLeft: 7 }}>
                <Button variant="outlined" onClick={onDelete} disabled={isSaving}>
                  {i18next.t("app.delete")}
                </Button>
              </div>
            )}
            <div style={{ marginLeft: 7 }}>
              <Button variant="contained" color="primary" disabled={isSaving} onClick={this.handleSave}>
                {i18next.t("app.saveChanges")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
