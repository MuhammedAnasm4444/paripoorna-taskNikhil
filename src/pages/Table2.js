import { useEffect, useState } from "react";
import { CustomerService } from "../components/service/Service";
import DataTableDemo from "../components/table/DataTable";

function Table2() {
  let headings = ["id", "name",  "company", "email"];
  const [loading, setLoading] = useState(true);
  const customerService = new CustomerService();
  const [customers, setCustomers] = useState(null);
  const [ref,setRef]=useState(true)
  const refresh = ()=> setRef(!ref) 
  useEffect(() => {
    customerService.getCustomersLarge().then((data) => {

      setCustomers(getCustomers(data));
      setLoading(false);
    });
  }, [ref]); // eslint-disable-line react-hooks/exhaustive-deps
  const getCustomers = (data) => {
    return [...(data || [])].map((d) => {
      d.date = new Date(d.date);
      return d;
    });
  };
  return (
    <div className="App">
      <DataTableDemo
        globalSearch={false}
        headers={headings}
        data={customers}
        loading={loading}
        pagination={false}
        sorting={true}
        refresh={refresh}
        refreshButton={true}
        table={2}
      />
    </div>
  );
}

export default Table2;
