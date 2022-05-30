import React, { Component } from "react";
import { IconButton, Accordion, AccordionSummary, AccordionDetails, Typography, Grid } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import withStyles from "./withStyles";
import lodash from "lodash";
export class ComponentX extends Component {
  renderClasses = (kind, from = "accordion") => {
    const r = (kind || "") === "" ? "" : lodash.upperFirst(kind);
    return `${(this.props.kinds || [])
      .map((o) => this.props.classes[`${from}${r}${lodash.upperFirst(o)}`])
      .filter((h) => h)
      .join(" ")} ${this.props[`class${r === "" && from === "accordion" ? "Name" : r}`]}`;
  };
  render() {
    const { title, children, onAdd, onDelete, defaultExpanded } = this.props;
    return (
      <div style={{ position: "relative" }}>
        {(onAdd || onDelete) && (
          <IconButton size="small" className={this.renderClasses("", "btn")} onClick={onAdd || onDelete}>
            <FontAwesomeIcon icon={onAdd ? faPlus : faTrash} />
          </IconButton>
        )}
        <Accordion className={this.renderClasses()} defaultExpanded={defaultExpanded}>
          <AccordionSummary
            className={this.renderClasses("title")}
            style={{ paddingLeft: onAdd || onDelete ? 70 : 0 }}
            expandIcon={<FontAwesomeIcon icon={faAngleDown} />}
          >
            <Typography>{title}</Typography>
          </AccordionSummary>
          <AccordionDetails className={this.renderClasses("detail")}>
            <div style={{ width: "100%" }}>{children}</div>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }
}
export default withStyles(ComponentX);
