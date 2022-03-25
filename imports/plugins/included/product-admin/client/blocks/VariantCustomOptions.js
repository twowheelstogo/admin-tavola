import React, { useState } from "react";
import { i18next } from "/client/api";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Box,
  MenuItem,
  makeStyles,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import useReactoForm from "reacto-form/cjs/useReactoForm";
import SimpleSchema from "simpl-schema";
import muiOptions from "reacto-form/cjs/muiOptions";
import { Button, TextField } from "@reactioncommerce/catalyst";
import useProduct from "../hooks/useProduct";
import muiCheckboxOptions from "reacto-form/cjs/muiCheckboxOptions";

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(2),
  },
  textField: {
    marginBottom: theme.spacing(4),
  },
}));

const formSchema = new SimpleSchema({
  multipleOption: {
    type: Boolean,
    optional: true,
  },
  maxOption: {
    type: Number,
    optional: true,
  },
  minOption: {
    type: Number,
    optional: true,
  },
});

const validator = formSchema.getFormValidator();

/**
 * @name VariantCustomOptions
 * @param {Object} props Component props
 * @param {Object} ref Forwarded ref
 * @returns {React.Component} Variant form React component
 */
const VariantCustomOptions = React.forwardRef((props, ref) => {
  const classes = useStyles();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { onUpdateProductVariant, product, variant, option } = useProduct();

  const editingVariant = option || variant;

  const {
    getFirstErrorMessage,
    getInputProps,
    hasErrors,
    isDirty,
    submitForm,
  } = useReactoForm({
    async onSubmit(formData) {
      setIsSubmitting(true);

      await onUpdateProductVariant({
        variantId: editingVariant._id,
        variant: formSchema.clean(formData),
      });

      setIsSubmitting(false);
    },
    validator(formData) {
      return validator(formSchema.clean(formData));
    },
    value: editingVariant,
  });

  return (
    <Card className={classes.card} ref={ref}>
      <CardHeader title={i18next.t("admin.productAdmin.details")} />
      <CardContent>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submitForm();
          }}
        >
          <Box marginBottom={4}>
            <FormControlLabel
              label={i18next.t("productVariant.multipleOption")}
              control={<Checkbox />}
              {...getInputProps("multipleOption", muiCheckboxOptions)}
            />
          </Box>
          <Grid container spacing={1}>
            <Grid item sm={6}>
              <TextField
                className={classes.textField}
                error={hasErrors(["maxOption"])}
                fullWidth
                helperText={getFirstErrorMessage(["maxOption"])}
                label={i18next.t("productVariant.maxOption")}
                placeholder="0"
                {...getInputProps("maxOption", muiOptions)}
              />
            </Grid>
            <Grid item sm={6}>
              <TextField
                className={classes.textField}
                error={hasErrors(["minOption"])}
                fullWidth
                helperText={getFirstErrorMessage(["v"])}
                label={i18next.t("productVariant.minOption")}
                placeholder="0"
                {...getInputProps("minOption", muiOptions)}
              />
            </Grid>
          </Grid>

          <Box textAlign="right">
            <Button
              color="primary"
              disabled={!product || !isDirty || isSubmitting}
              isWaiting={isSubmitting}
              type="submit"
              variant="contained"
            >
              {i18next.t("app.saveChanges")}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
});

export default VariantCustomOptions;