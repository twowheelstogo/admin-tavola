import React, { Component } from "react";
import { i18next } from "/client/api";
import withStyles from "./withStyles";
import Locations from "/plugins/locations/client/form.js";
import { Typography, Grid } from "@material-ui/core";
import Accordionx from "/plugins/client/accordion/index.js";
import Text from "/plugins/client/text/index.js";
import constructor from "/plugins/client/utils/index.js";
export class ShippingDestination extends Component {
  name = "destinations";
  constructor(props) {
    super(props);
    this.state = {};
    constructor(this, props);
  }

  OnNewDestination = (e) => {
    this.onUpdate({ def: [], callback: (destinations) => destinations.concat([{}]) });
  };
  OnDeleteDestination = (index, e) => {
    this.onUpdate({
      def: [],
      callback: (destinations) => {
        destinations.splice(index, 1);
        return destinations;
      },
    });
  };
  OnNewLength = (destinationIndex, e) => {
    this.onUpdate({
      def: [],
      callback: (destinations) => {
        if (!destinations[destinationIndex].lengths) destinations[destinationIndex].lengths = [];
        destinations[destinationIndex].lengths.push({});
        return destinations;
      },
    });
  };
  OnDeleteLength = (destinationIndex, lengthIndex, e) => {
    this.onUpdate({
      def: [],
      callback: (destinations) => {
        if (!destinations[destinationIndex].lengths) destinations[destinationIndex].lengths = [];
        destinations[destinationIndex].lengths.splice(lengthIndex, 1);
        return destinations;
      },
    });
  };

  render() {
    const { classes, form, onForm, ...propsWithOutClasses } = this.props;
    return onForm((form) => {
      return (
        <Accordionx
          title={i18next.t("admin.shippingGrid.destinations", "Destinations")}
          kinds={["def", "noPadding"]}
          onAdd={this.OnNewDestination}
        >
          {form &&
            (form.state.value.destinations || []).map((destination, index) => {
              return (
                <Accordionx
                  kinds={["lite", "def", "noPadding"]}
                  key={`destination_${index}`}
                  onDelete={(e) => this.OnDeleteDestination(index, e)}
                  title={
                    <span>
                      <b>{index + 1}</b> <small>{i18next.t("admin.shippingGrid.destination", "Destination")}</small>
                    </span>
                  }
                >
                  <Accordionx kinds={["def", "child"]} title="Location">
                    <Locations
                        {...this.props}
                      path={`destinations.${index}.`}
                      classParent={classes}
                      shippingDestinationState={this.state}
                    />
                  </Accordionx>
                  <Accordionx kinds={["def", "child"]} title="Price">
                    <Grid container spacing={2}>
                      <Text
                        {...this.props}
                        xs={12}
                        name={`destinations[${index}].price`}
                        type="numeric"
                        label={i18next.t("shippingMethod.price", "Price")}
                      />
                      <Text
                        {...this.props}
                        name={`destinations[${index}].rate`}
                        type="numeric"
                        label={i18next.t("shippingMethod.rateDefault", "Rate (default: 1000)")}
                      />
                      <Text
                        {...this.props}
                        name={`destinations[${index}].position`}
                        type="numeric"
                        label={i18next.t("shippingMethod.position", "Position")}
                      />
                    </Grid>
                  </Accordionx>
                  <Accordionx
                    kinds={["def", "child", "noPadding"]}
                    title={i18next.t("admin.shippingGrid.lengths", "Lengths")}
                    onAdd={(e) => this.OnNewLength(index, e)}
                  >
                    {(destination.lengths || []).map((len, iLength) => (
                      <Accordionx
                        kinds={["lite", "def"]}
                        key={`destination_length_${iLength}`}
                        onDelete={(e) => this.OnDeleteLength(index, iLength, e)}
                        title={
                          <Typography>
                            <b>{iLength + 1}</b>
                            <small>{i18next.t("admin.shippingGrid.length", "Length")}</small>
                          </Typography>
                        }
                      >
                        <Grid container spacing={2}>
                          <Text
                            {...this.props}
                            name={`destinations[${index}].lengths[${iLength}].max`}
                            type="numeric"
                            label={i18next.t("shippingMethod.maxLength", "Max Length")}
                          />
                          <Text
                            {...this.props}
                            name={`destinations[${index}].lengths[${iLength}].min`}
                            type="numeric"
                            label={i18next.t("shippingMethod.minLength", "Min Length")}
                          />
                        </Grid>
                        <Grid container spacing={2}>
                          <Text
                            {...this.props}
                            xs={12}
                            name={`destinations[${index}].lengths[${iLength}].price`}
                            type="numeric"
                            label={i18next.t("shippingMethod.price", "Price")}
                          />
                          <Text
                            {...this.props}
                            name={`destinations[${index}].lengths[${iLength}].rate`}
                            type="numeric"
                            label={i18next.t("shippingMethod.rate", "Rate (default: 1000)")}
                          />
                          <Text
                            {...this.props}
                            name={`destinations[${index}].lengths[${iLength}].position`}
                            type="numeric"
                            label={i18next.t("shippingMethod.position", "Position")}
                          />
                        </Grid>
                      </Accordionx>
                    ))}
                  </Accordionx>
                </Accordionx>
              );
            })}
        </Accordionx>
      );
    });
  }
}
export default withStyles(ShippingDestination);
