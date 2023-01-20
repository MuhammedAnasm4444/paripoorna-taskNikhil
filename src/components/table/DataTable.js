import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "../../index.css";

import React, { useState, useEffect } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { useNavigate } from 'react-router-dom';
import "./DataTableDemo.css";
import { Button } from "primereact/button";

export default function DataTableDemo({
  globalSearch,
  headers,
  data,
  loading,
  pagination,
  sorting,
  refreshButton,
  isRefresh,
  table
}) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [selectedCustomers, setSelectedCustomers] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  useEffect(() => {
    setFilteredData(data)
  }, [isRefresh]);

  useEffect(() => {
    let obj = {};
    if (globalSearch) {
      obj.global = { value: null, matchMode: FilterMatchMode.CONTAINS };
    }
    setFilters(obj);
    setFilteredData(data);
  }, [globalSearch, headers, loading]);


  const globalFilter = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between align-items-center">
        <h5 className="m-0">Customers Table - {table}</h5>
        {globalSearch && (
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={globalFilter}
              placeholder="Keyword Search"
            />
          </span>
        )}
      </div>
    );
  };
  const header = renderHeader();
  function columnFilter(e){
    if (e.target.value) {
      let array = []
      function escapeRegExp(string) {
        if (string.length != 0) {
          return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }
      }
      let escpd = escapeRegExp(e.target.value);
      var regex = new RegExp(escpd, "i");
      for (let i = 0; i < data.length; i++) {
        var element = data[i];
        let con = element[e.target.name].toString()
        if (e.target.name && con.match(regex)) {
          array.push(element)
        }
        setFilteredData(array)
      }
    }
    if (e.target.value === '') {
      setFilteredData(data)
    }
  };
  return (
    <div className="datatable-doc-demo">
      <Button className="p-button-warning" onClick={() => {
        table === 2 ? navigate("/") : navigate("/table2")

      }} style={{ marginBottom: "20px" }} align="right">
       {
        table === 2 ? "View Table-1" : "View Table-2"
       }
      </Button>
      {refreshButton && (
        <Button
          style={{ marginBottom: "20px", marginLeft: "20px" }}
          align="right"
          onClick={() => {
            setFilteredData(data)
          }}
        >
         {/* <i className="pi-refresh" style="font-size: 2rem"></i> */}
         Refresh

        </Button>
      )}
      <div className="card" style={{ marginBottom : "20px"}}>
        {headers &&
          headers.map((heading) => {
            return (
              <>
                <InputText
                  key={heading}
                  placeholder={`Filter : ${heading}`}
                  style={{ marginRight: "20px" }}
                  onChange={columnFilter}
                  name={heading}
                //   value={name === el ? key : ""}
                />
              </>
            );
          })}
        <DataTable
          value={filteredData}
          paginator={pagination}
          className="p-datatable-customers"
          header={header}
          rows={10}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          rowsPerPageOptions={[10, 25, 50]}
          dataKey="id"
          rowHover
          selection={selectedCustomers}
          onSelectionChange={(e) => setSelectedCustomers(e.value)}
          filters={filters}
          filterDisplay="menu"
          loading={loading}
          responsiveLayout="scroll"
          emptyMessage="No customers found."
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        >
          {headers &&
            headers.map((el) => {
              return <Column key={el} field={el} header={el} sortable={sorting} />;
            })}
        </DataTable>
      </div>
    </div>
  );
}
