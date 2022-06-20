import { CSVLink } from "react-csv";
const Excel = ({ exceldata,name }) => {
  const data =exceldata;
  
    return (
      <div className="Excelclass">
      <button className="btn">
        <CSVLink 
          data={data}
          filename={`${name}_엑셀.csv`} 
        >
          엑셀 파일로 내려받기
        </CSVLink>
      </button>
      </div>
    );
  };
  export default Excel;