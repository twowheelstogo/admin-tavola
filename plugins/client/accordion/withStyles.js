import withStyles from "@material-ui/core/styles/withStyles";
const styles = (theme) => ({
  btnDef: {
    position: "absolute",
    borderRight: "1px dashed #e9e9e9",
    padding: "16px 20px 16px 28px",
    top: 0,
    left: 0,
    zIndex: 1,
    borderRadius: 0,
  },
  btnLite: {
    padding: "7px 18px 7px 28px",
    borderColor: "#555",
    height: 34,
    "& svg": {
      transform: "scale(0.5)",
    },
  },
  btnChild: {
    padding: "10px 20px 10px 28px",
  },
  btnDetailLite: {
    position: "absolute",
    borderRight: "1px dashed #e9e9e9",
    padding: "7px 20px 7px 28px",
    top: 0,
    left: 0,
    zIndex: 1,
    borderRadius: 0,
    backgroundColor: "green",
  },
  accordionDef: {
    "&.Mui-expanded": {
      margin: 0,
      borderColor: "#eee",
      "& > .MuiAccordionSummary-root.Mui-expanded": {
        minHeight: 5,
      },
      "& > .MuiButtonBase-root>.MuiAccordionSummary-content": {
        margin: 14,
      },
    },
    "& > .MuiButtonBase-root>.MuiAccordionSummary-content": {
      margin: 14,
    },
  },
  // accordionTitleDef: { margin: 14 },
  // accordionNoPadding: {
  //   "& > .MuiCollapse-container > .MuiCollapse-wrapper > .MuiCollapse-wrapperInner > div > .MuiAccordionDetails-root": {
  //     padding: 2,
  //   },
  // },
  accordionDetailNoPadding: { padding: 2 },
  accordionLite: {
    paddingTop: 0,
    paddingBottom: 0,
    "&.Mui-expanded": {
      margin: 0,
      borderColor: "#eee",
      "& > .MuiAccordionSummary-root.Mui-expanded": {
        minHeight: 5,
      },
      // "& > .MuiButtonBase-root>.MuiAccordionSummary-content.Mui-expanded": {
      //   margin: 5,
      // },
    },
    "& >.MuiAccordionSummary-root": {
      minHeight: 0,
      backgroundColor: "#eee",
    },
    "& .MuiIconButton-label": {
      transform: "scale(0.7)",
    },
    "& > .MuiButtonBase-root>.MuiAccordionSummary-content": {
      margin: 5,
    },
    "& .MuiAccordionSummary-root.Mui-expanded": {
      minHeight: 0,
    },
    "& > .MuiAccordionSummary-root > .MuiIconButton-root": {
      paddingTop: 0,
      paddingBottom: 0,
    },
  },
  accordionTitleLite: {
    backgroundColor: "green",
  },
  accordionSummaryLite: {
    backgroundColor: "green",
  },
  accordionDetailLite: {
    "& > .MuiCollapse-container > .MuiCollapse-wrapper > .MuiCollapse-wrapperInner > div > .MuiAccordionDetails-root": {
      padding: 0,
    },
  },
  accordionChild: {
    borderColor: "transparent",
    "& > .MuiButtonBase-root>.MuiAccordionSummary-content": {
      margin: "5px 0",
    },
  },
  accordionTitleChild: {
    margin: "0 0 0 14px",
    minHeight: 40,
    paddingRight: 4,
    "&.Mui-expanded": {
      minHeight: "40px !important",
    },
    "&  > .MuiIconButton-root": {
      paddingTop: 0,
      paddingBottom: 0,
    },
  },
  accordionSummaryDetailLite: {
    backgroundColor: "red",
    backgroundColor: "#eee",
    borderRadius: 0,
  },
});
export default (compo) => withStyles(styles, "AccordionX")(compo);
