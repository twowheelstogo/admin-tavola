import withStyles from "@material-ui/core/styles/withStyles";
const styles = (theme) => ({
  root: {
    "& > .MuiPaper-root": {
      zIndex: 999999,
    },
    "& .makeStyles-valueContainer-60": {
      zIndex: 9999,
    },
  },
});
export default (compo) => withStyles(styles)(compo);