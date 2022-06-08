import React, { Component, Fragment } from "react";
import lodash from "lodash";
import withStyles from "@material-ui/core/styles/withStyles";
import { Grid } from "@material-ui/core";
import Autocomplete from "/plugins/client/autocomplete/index.js";
export class Location extends Component {
  static list = ["countries", "regions", "cities", "postals", "districts", "steets"];
  constructor(props) {
    super(props);
    this.state = {
      locations: Location.list.reduce((p, c) => ({ ...Component, [c]: { in: [], nin: [] } }), {}),
    };
  }
  async componentDidMount() {
    // const { citiesLoading } = this.state;
    // if (!citiesLoading && regionsCitiesJson && regionsCitiesJson.trim() != "") {
    //   this.setState({ citiesLoading: true });
    //   fetch(regionsCitiesJson)
    //     .then((data) => data.json())
    //     .then((result) => {
    //       if (result.cities) this.setState({ cities: result.cities });
    //     });
    // }
  }

  setSelected = (o) => {
    // const cities = lodash.uniq(_cities.map(({ value }) => value));
    // this.form.state.value[name] = cities;
    // this.setState({ [name]: cities });
  };
  setNew = (o) => {
    // const cities = lodash.uniq(_cities.map(({ value }) => value));
    // this.form.state.value[name] = cities;
    // this.setState({ [name]: cities });
    // this.props.statics.setStatic(name, { value })
    return o.chosen;
  };
  render() {
    const { classes, value, onSelection, ...propsWithoutClasses } = this.props;
    return (
      <Fragment>
        {Location.list.map((r) => {
          return (
            <Grid key={r + this.props.uniqId} container spacing={1}>
              {["inp", "out"].map((o) => {
                const name = `${r}${o}`;
                return (
                  <Grid key={name + this.props.uniqId} item xs={6}>
                    <Autocomplete
                      form={propsWithoutClasses.form}
                      onReady={propsWithoutClasses.onReady}
                      uniqId={propsWithoutClasses.uniqId}
                      isMulti={true}
                      name={`${this.props.path}location.${r}.${o}`}
                      i18nDef={`${lodash.upperFirst(r)} ${{ inp: "Includes", out: "Excludes" }[o]}`}
                      onNew={(value, chosen) => this.setNew({ name, value, chosen })}
                    />
                  </Grid>
                );
              })}
            </Grid>
          );
        })}
      </Fragment>
    );
  }
}

const styles = (theme) => ({});
export default withStyles(styles)(Location);
