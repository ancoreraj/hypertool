import type { FunctionComponent, ReactElement, ReactNode } from "react";

import MainToolbar from "./MainToolbar";
import MainFooter from "./MainFooter";

interface Props {
  children?: ReactNode;
  toolbar?: boolean;
  footer?: boolean;
}

const VisitorLayout: FunctionComponent<Props> = (
  props: Props
): ReactElement => {
  const { toolbar, children, footer } = props;

  return (
    <>
      {toolbar && <MainToolbar />}
      <main>{children}</main>
      {footer && <MainFooter />}
    </>
  );
};

VisitorLayout.defaultProps = {
  toolbar: true,
  footer: true,
};

VisitorLayout.displayName = "VisitorLayout";

export default VisitorLayout;
