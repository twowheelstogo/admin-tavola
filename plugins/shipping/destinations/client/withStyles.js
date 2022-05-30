import withStyles from "@material-ui/core/styles/withStyles";
const styles = (theme) => ({
  // accordionLite: {
  //   paddingTop: 0,
  //   paddingBottom: 0,
  //   "&.Mui-expanded": {
  //     margin: 0,
  //     borderColor: "#eee",
  //     "& > .MuiButtonBase-root>.MuiAccordionSummary-content.Mui-expanded": {
  //       margin: "14px 0",
  //     },
  //   },
  //   "& .MuiAccordionSummary-root": {
  //     minHeight: 0,
  //   },
  //   "& .MuiIconButton-label": {
  //     transform: "scale(0.7)",
  //   },
  //   "& .MuiAccordionSummary-content": {
  //     margin: 0,
  //   },
  //   "& .MuiAccordionSummary-root.Mui-expanded": {
  //     minHeight: 0,
  //   },
  //   "& .MuiAccordionSummary-content.Mui-expanded": {
  //     margin: 0,
  //   },
  //   "& .MuiIconButton-root": {
  //     paddingTop: 0,
  //     paddingBottom: 0,
  //   },
  // },
  // accordionDetailLite: {
  //   "& > .MuiCollapse-container > .MuiCollapse-wrapper > .MuiCollapse-wrapperInner > div > .MuiAccordionDetails-root": {
  //     padding: 0,
  //   },
  // },
  // accordionSummaryDetailLite: {
  //   backgroundColor: "#eee",
  //   borderRadius: 0,
  // },
});
export default (compo) => withStyles(styles)(compo);
