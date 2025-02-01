import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.jsx';

import TableThree from '../../components/Tables/Inventory.jsx';

const FormElements = () => {
  return (
    <>
      <Breadcrumb pageName="Inventory" />

      <div className="flex flex-col gap-10">

        <TableThree />
 
      </div>
    </>
  );
};

export default FormElements;
