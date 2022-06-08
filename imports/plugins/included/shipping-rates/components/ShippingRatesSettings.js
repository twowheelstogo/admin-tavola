/* eslint-disable promise/no-promise-in-callback */
import React, { Component } from "react";
import PropTypes from "prop-types";
import SimpleSchema from "simpl-schema";
import { Meteor } from "meteor/meteor";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { Shipping } from "/lib/collections";
import { Reaction, formatPriceString, i18next } from "/client/api";
import { IconButton, Loading, SortableTable } from "/imports/plugins/core/ui/client/components";
import simpleGraphQLClient from "/imports/plugins/core/graphql/lib/helpers/simpleClient";
import ShippingMethodForm from "./ShippingMethodForm";
import flatRateFulfillmentMethodsQuery from "../graphql/queries/flatRateFulfillmentMethods";
import { Query } from "react-apollo";
import { withApollo } from "react-apollo";
import lodash from "lodash";
import cleaner from "/plugins/client/utils/cleaner.js";
const lengthSchema = new SimpleSchema({
  minLength: { type: Number, optional: true, min: 0 },
  maxLength: { type: Number, optional: true, min: 0 },
  min: { type: Number, optional: true, min: 0 },
  max: { type: Number, optional: true, min: 0 },
  price: { type: Number, optional: true, min: 0 },
  rate: { type: Number, optional: true, min: 0 },
  position: { type: Number, optional: true, min: 0 },
  currency: { type: String, optional: true },
  _id: { type: String, optional: true },
});

const destinationSchema = new SimpleSchema({
  _id: { type: String, optional: true },
  currency: { type: String, optional: true },
  price: { type: Number, optional: true },
  rate: { type: Number, optional: true },
  distance: { type: Number, optional: true },
  position: { type: Number, optional: true },
  isLength: { type: Boolean, optional: true },
  lengths: { type: Array, optional: true },
  "lengths.$": {
    type: lengthSchema,
    blackbox: true,
    optional: true,
  },
});

const fulfillmentMethodFormSchema = new SimpleSchema({
  name: {
    type: String,
    optional: true,
  },
  label: {
    type: String,
    optional: true,
  },
  group: {
    type: String,
    allowedValues: ["Free", "Ground", "One Day", "Priority"],
    optional: true,
  },
  cost: {
    type: Number,
    optional: true,
    defaultValue: 0,
  },
  handling: {
    type: Number,
    min: 0,
    optional: true,
    defaultValue: 0,
  },
  rate: {
    type: Number,
    min: 0,
    optional: true,
    defaultValue: 0,
  },
  position: {
    type: Number,
    min: 0,
    optional: true,
    defaultValue: 0,
  },
  citiesIncludes: {
    type: Array,
    optional: true,
  },
  "citiesIncludes.$": String,
  citiesExcludes: {
    type: Array,
    optional: true,
  },
  "citiesExcludes.$": String,
  langs: {
    type: Array,
    optional: true,
  },
  "langs.$": String,
  i18ns: {
    type: Array,
    optional: true,
  },
  "i18ns.$": { type: Object, blackbox: true },
  fulfillmentTypes: {
    type: Array,
    optional: true,
  },
  "fulfillmentTypes.$": String,
  isEnabled: { type: Boolean, optional: true, defaultValue: false },
  destinations: {
    type: Array,
    optional: true,
  },
  "destinations.$": {
    type: destinationSchema,
    optional: true,
    blackbox: true,
  },
  apiDistance: {
    type: Object,
    optional: true,
    blackbox: true,
  },
});

const fulfillmentMethodValidator = fulfillmentMethodFormSchema.getFormValidator();
const groupOptions = fulfillmentMethodFormSchema
  .getAllowedValuesForKey("group")
  .map((groupName) => ({ label: groupName, value: groupName }));

const customRowMetaData = {
  bodyCssClassName: () => "shipping-grid-row",
};

/**
 * @summary filter and extract shipping methods from flat rate shipping provider
 * @param {Object[]} results The find results
 * @returns {Object[]} The methods from the flatRates record
 */
function transform(results) {
  const provider = results.find(
    (shippingRecord) => shippingRecord.provider && shippingRecord.provider.name === "flatRates"
  );
  if (!provider) return [];

  return (provider.methods || []).map((method) => ({
    ...method,
    rate: formatPriceString(method.rate),
  }));
}

export class ShippingRatesSettings extends Component {
  static propTypes = {
    fulfillmentMethods: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
      })
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      isSaving: false,
      editingId: null,
      fulfillmentMethods: props.fulfillmentMethods || [],
    };
  }
  get shopId() {
    return this.props.shopId || Reaction.getShopId();
  }

  getData = async () => {
    const { data } = await this.props.client.query({
      query: flatRateFulfillmentMethodsQuery,
      variables: {
        shopId: this.shopId,
        // ...filterByProductIds,
        // query: globalFilter,
        // first: pageSize,
        // limit: (pageIndex + 1) * pageSize,
        // offset: pageIndex * pageSize,
      },
      fetchPolicy: "network-only",
    });
    this.setState({ fulfillmentMethods: ((data || {}).flatRateFulfillmentMethods || {}).nodes || [] });
  };
  componentDidMount() {
    this.getData();
  }
  successAction = (opts = {}, resolver) => {
    this.setState({ isEditing: false, editingId: null }, () => {
      let fulfillmentMethods = [...this.state.fulfillmentMethods];
      const doc = (Object.values(opts.val)[0] || {}).method || {};
      const methodId = doc._id || this.state.editingId;
      if (opts.action === "deleted") {
        fulfillmentMethods = fulfillmentMethods.filter((f) => f._id !== methodId);
      } else if (opts.action === "created") {
        fulfillmentMethods.push(doc);
      } else if (opts.action === "saved") {
        fulfillmentMethods = fulfillmentMethods.map((f) => {
          if (f._id === methodId) return { ...f, ...doc };
          return f;
        });
      }
      this.setState({ fulfillmentMethods, isSaving: false });
      Alerts.toast(
        i18next.t(opts.action === "deleted" ? `shipping.shippingMethodDeleted` : "admin.shippingSettings.rateSaved"),
        "success"
      );
      // Alerts.toast(i18next.t("admin.shippingSettings.rateSaved"), "success");
      if (resolver) resolver();
    });
    return null;
  };
  handleEditClick = () => {
    const { isEditing = false } = this.state;
    let { editingId = null } = this.state;
    if (!isEditing) {
      editingId = null;
    }

    this.setState({
      isEditing: !isEditing,
      editingId,
    });
  };

  handleRowClick = (options) => {
    const { editingId = null } = this.state;

    const clickedId = options.props.data._id;
    if (editingId === clickedId) {
      this.setState({
        isEditing: false,
        editingId: null,
      });
    } else {
      this.setState({
        isEditing: true,
        editingId: clickedId,
      });
    }
  };

  handleFormCancel = () => {
    this.setState({
      isEditing: false,
      editingId: null,
    });
  };

  handleFormDelete = () => {
    const { editingId = null } = this.state;
    const confirmTitle = i18next.t("admin.shippingSettings.confirmRateDelete");
    const confirmButtonText = i18next.t("app.delete");

    // confirm delete
    Alerts.alert(
      {
        title: confirmTitle,
        type: "warning",
        showCancelButton: true,
        confirmButtonText,
      },
      (isConfirm) => {
        if (isConfirm && editingId) {
          const methodInput = [
            { namespace: "Shop", id: this.shopId },
            { namespace: "FulfillmentMethod", id: editingId },
          ];
          Meteor.call("getOpaqueIdFromInternalId", methodInput, (error, opaqueIds) => {
            const [opaqueShopId, opaqueEditingId] = opaqueIds;
            this.setState({ isSaving: true });
            simpleGraphQLClient.mutations
              .deleteFlatRateFulfillmentMethod({
                input: {
                  methodId: editingId || opaqueEditingId,
                  shopId: opaqueShopId,
                },
              })
              .then((val) => {
                return this.successAction({ action: "deleted", opaqueIds, val, editingId });
              })
              .catch((error2) => {
                Alerts.toast(`${i18next.t("admin.shippingSettings.rateFailed")} ${error2}`, "error");
                this.setState({ isSaving: false });
              });
          });
        }
      }
    );
  };

  handleFormValidate = (doc) => fulfillmentMethodValidator(fulfillmentMethodFormSchema.clean(doc));

  handleFormSubmit = ({ destinations, i18ns, target, ...doc }) => {
    const { editingId = null } = this.state;
    this.setState({ isSaving: true });
    // We don't yet have a NumberInput, so we'll make these strings for now.
    // Remove this and switch to NumberInput once we have it.
    const cleanedDoc = fulfillmentMethodFormSchema.clean(doc);
    cleanedDoc.i18ns = (i18ns || []).map(cleaner);
    cleanedDoc.destinations = (destinations || []).map((inpu) => cleaner(inpu, { strToNum: true }));
    cleanedDoc.fulfillmentTypes = cleanedDoc.fulfillmentTypes || ["shipping"];
    ///|\\\|///|\\\|///|\\\
    ///      Class
    ///|\\\|///|\\\|///|\\\
    return new Promise((resolve) => {
      if (editingId) {
        const methodInput = [
          { namespace: "Shop", id: this.shopId },
          { namespace: "FulfillmentMethod", id: editingId },
        ];
        Meteor.call("getOpaqueIdFromInternalId", methodInput, (error, opaqueIds) => {
          const [opaqueShopId, opaqueEditingId] = opaqueIds;
          simpleGraphQLClient.mutations
            .updateFlatRateFulfillmentMethod({
              input: {
                methodId: doc._id || opaqueEditingId,
                method: cleanedDoc,
                shopId: opaqueShopId,
              },
            })
            .then((val) => {
              return this.successAction({ action: "saved", opaqueIds, val, editingId, doc: cleanedDoc }, resolve);
            })
            .catch((error2) => {
              Alerts.toast(`${i18next.t("admin.shippingSettings.rateFailed")} ${error2}`, "error");
              this.setState({ isSaving: false });
              resolve({ ok: false });
            });
        });
      } else {
        const methodInput = [{ namespace: "Shop", id: this.shopId }];
        Meteor.call("getOpaqueIdFromInternalId", methodInput, (error, opaqueIds) => {
          const [opaqueShopId] = opaqueIds;
          simpleGraphQLClient.mutations
            .createFlatRateFulfillmentMethod({
              input: {
                method: cleanedDoc,
                shopId: opaqueShopId,
              },
            })
            .then((val) => {
              return this.successAction({ action: "created", opaqueIds, val, editingId, doc: cleanedDoc }, resolve);
            })
            .catch((error2) => {
              Alerts.toast(`${i18next.t("admin.shippingSettings.rateFailed")} ${error2}`, "error");
              this.setState({ isSaving: false });
              resolve({ ok: false });
            });
        });
      }
    });
  };

  renderShippingGrid(opts = {}) {
    const filteredFields = ["name", "group", "label", "rate"];
    const noDataMessage = i18next.t("admin.shippingSettings.noRatesFound");

    // add i18n handling to headers
    const customColumnMetadata = [];
    filteredFields.forEach((field) => {
      const columnMeta = {
        accessor: field,
        Header: i18next.t(`admin.shippingGrid.${field}`),
      };
      customColumnMetadata.push(columnMeta);
    });
    // query={{ shopId: this.props.shopId || this.shopId }}
    return (
      <SortableTable
        collection={Shipping}
        columnMetadata={customColumnMetadata}
        columns={filteredFields}
        externalLoadingComponent={Loading}
        filteredFields={filteredFields}
        matchingResultsCount="shipping-count"
        noDataMessage={noDataMessage}
        onRowClick={this.handleRowClick}
        publication="Shipping"
        rowMetadata={customRowMetaData}
        showFilter
        tableClassName="-striped -highlight shippingGrid"
        transform={transform}
        {...opts}
      />
    );
  }

  renderEditButton() {
    const { isEditing = false } = this.state;

    return (
      <div className="clearfix">
        <div className="pull-right">
          <IconButton
            icon="fa fa-plus"
            onIcon="fa fa-pencil"
            toggle
            toggleOn={isEditing}
            style={{
              position: "relative",
              top: "-25px",
              right: "8px",
            }}
            onClick={this.handleEditClick}
          />
        </div>
      </div>
    );
  }

  renderShippingMethodForm(fulfillmentMethods) {
    // const { fulfillmentMethods } = this.props;
    const { editingId, isSaving } = this.state;

    let methodDoc = null;
    if (editingId && fulfillmentMethods && fulfillmentMethods.length) {
      methodDoc = fulfillmentMethods.find((method) => method._id === editingId);
      // We don't yet have a NumberInput, so we'll make these strings for now.
      // Remove this and switch to NumberInput once we have it.
      if (methodDoc) {
        methodDoc = {
          ...cleaner(methodDoc, { numToStr: true }),
          isEnabled: typeof methodDoc.isEnabled === "boolean" ? methodDoc.isEnabled : methodDoc.enabled || false, // backwards compatible
        };
      }
    }
    // We set the labels in here so that the error messages have the correct matching label.
    // We can't set them in top-level code because translations are not loaded yet.
    fulfillmentMethodFormSchema.labels({
      cost: i18next.t("shippingMethod.cost"),
      isEnabled: i18next.t("shippingMethod.enabled"),
      group: i18next.t("shippingMethod.group"),
      handling: i18next.t("shippingMethod.handling"),
      label: i18next.t("shippingMethod.label"),
      name: i18next.t("shippingMethod.name"),
      rate: i18next.t("shippingMethod.rate"),
    });

    return (
      <ShippingMethodForm
        {...this.props}
        groupOptions={groupOptions}
        isEditing={!!editingId}
        methodDoc={methodDoc}
        isSaving={isSaving}
        onCancel={this.handleFormCancel}
        onDelete={this.handleFormDelete}
        validator={this.handleFormValidate}
        onSubmit={this.handleFormSubmit}
      />
    );
  }

  render() {
    const { isEditing = false } = this.state;

    return (
      <Card style={{ paddingBottom: 40 }}>
        <CardHeader title={i18next.t("admin.shippingSettings.flatRateLabel")} />
        <CardContent>
          {this.renderShippingGrid({ data: this.state.fulfillmentMethods })}
          {this.renderEditButton()}
          {isEditing && this.renderShippingMethodForm(this.state.fulfillmentMethods)}
        </CardContent>
      </Card>
    );
  }
}
export default withApollo(ShippingRatesSettings);
