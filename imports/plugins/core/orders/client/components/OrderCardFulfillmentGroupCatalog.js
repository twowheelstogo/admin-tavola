import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";

class OrderCardFulfillmentGroupCatalog extends Component {
  renderQty = (o) => {
    const { classes } = this.props;
    return (
      o.quantity &&
      o.quantity > 1 && (
        <span className={classes.qty}>
          {o.quantity} <b>x</b>
        </span>
      )
    );
  };
  renderOptions = (options) => {
    const { classes } = this.props;
    if (options && options.length) {
      return (
        <ul>
          {options
            .filter((op) => !op.isHidden)
            .map((op) => (
              <li>
                <span className={`${(op.options || []).length ? classes.hasOptions : classes.isOption}`}>
                  {this.renderQty(op)}
                  {op.value}
                </span>
                {this.renderOptions(op.options)}
              </li>
            ))}
        </ul>
      );
    }
    return "";
  };
  render() {
    const { classes, catalog } = this.props;
    return (
      <div className={classes.catalog}>
        <Typography className={classes.line} paragraph variant="h3">
          <span className={classes.product}>
            {this.renderQty(catalog)}
            {catalog.title}
          </span>
          <span className={classes.total}>{catalog.subtotal.displayAmount}</span>
        </Typography>
        {this.renderOptions(catalog.itemx)}
      </div>
    );
  }
}

const styles = (theme) => ({
  hasOptions: { fontWeight: "bold" },
  qty: { color: "red", fontWeight: "bold" },
  line: {
    position: "relative",
    fontWeight: "bold",
  },
  total: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  catalog: {
    fontSize: 14,
  },
  extraEmphasisText: {
    fontWeight: theme.typography.fontWeightSemiBold,
  },
});
export default withStyles(styles, { name: "OrderCardFulfillmentGroupCatalog" })(OrderCardFulfillmentGroupCatalog);
