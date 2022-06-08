import React, { Component } from "react";
import { i18next } from "/client/api";
import { Grid } from "@material-ui/core";
import Accordionx from "/plugins/client/accordion/index.js";
import Text from "/plugins/client/text/index.js";
import constructor from "/plugins/client/utils/index.js";
export class  ShippingApiDistance extends Component {
  name = "apiDistance";
  constructor(props) {
    super(props);
    this.state = {};
    constructor(this, props);
  }

  render() {
    const { classes, ...propsWithOutClasses } = this.props;
    return this.props.onReady((form) => {
      return form ? (
        <Accordionx title={i18next.t("admin.shippingGrid.api", `Api Distance Tomtom`)} kinds={["def"]}>
          <Grid container spacing={2}>
            <Text {...propsWithOutClasses} name={`apiDistance.url`} label={i18next.t("shippingMethod.url", "Url")} />
            <Text {...propsWithOutClasses} name={`apiDistance.key`} label={i18next.t("shippingMethod.key", "Key")} />
          </Grid>
          <Grid container spacing={2}>
            <Text
              {...propsWithOutClasses}
              name={`apiDistance.method`}
              label={i18next.t("shippingMethod.method", "method")}
            />
            <Text {...propsWithOutClasses} name={`apiDistance.path`} label={i18next.t("shippingMethod.path", "Path")} />
          </Grid>
          <Grid container spacing={2}>
            <Text
              {...propsWithOutClasses}
              xs={12}
              name={`apiDistance.body`}
              label={i18next.t("shippingMethod.body", "body")}
            />
          </Grid>
          <Grid container spacing={2}>
            <Text
              {...propsWithOutClasses}
              xs={12}
              name={`apiDistance.headers`}
              label={i18next.t("shippingMethod.headers", "headers")}
            />
          </Grid>
          <Grid container spacing={2}>
            <Text
              {...propsWithOutClasses}
              xs={12}
              name={`apiDistance.args`}
              label={i18next.t("shippingMethod.args", "args")}
            />
          </Grid>
        </Accordionx>
      ) : (
        <div>....</div>
      );
    });
  }
}
export default ShippingApiDistance;
