import { useFormikContext } from "formik";
import { Checkbox as MuiCheckbox } from "@mui/material";

interface Props {
  name: string;
  [key: string]: any;
}

const Checkbox = (props: Props) => {
  const { name, ...otherProps } = props;
  const formik = useFormikContext();

  return (
    <MuiCheckbox
      name={name}
      onBlur={formik.handleBlur}
      onChange={formik.handleChange}
      {...otherProps}
    />
  );
};

export default Checkbox;
