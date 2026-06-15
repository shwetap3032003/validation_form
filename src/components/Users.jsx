import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowDownUp } from "lucide-react";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";

function Users() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("PageNo")) || 1;
  const size = parseInt(searchParams.get("PageSize")) || 5;
  const [currentPage, setCurrentPage] = useState(page);
  const [itemsPerPage, setItemPerPage] = useState(size);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`https://ex-5n9q.onrender.com/api/users`);
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (_id) => {
    console.log("id", _id);

    try {
      const res = await axios.delete(
        `https://ex-5n9q.onrender.com/api/users/${_id}`,
      );
      console.log(res.data);

      if (res.status === 200 || res.status === 204) {
        setData(data.filter((item) => item._id !== _id));
        console.log("Deleted successfully");
        fetchUsers();
      } else {
        alert("Delete failed");
      }
    } catch (error) {
      console.log(error);
      alert("Error occurred");
    }
  };

  const handleEdit = (_editId) => {
    console.log("editId", _editId);
    navigate(`/signup/${_editId}`);
  };

  // Function to handle changes in the search input
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  // Function to handle column header clicks for sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (sort.key === key && sort.direction === "ascending") {
      direction = "descending";
    }
    setSort({ key, direction });
  };

  // const handlePageChange = (pageNumber) => {
  //   setCurrentPage(pageNumber);
  // };

  useEffect(() => {
    setSearchParams({ PageNo: currentPage, PageSize: itemsPerPage });
  }, [currentPage, itemsPerPage, setSearchParams]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage); // Triggers URL update via useEffect
    }
  };

  // Memoized data processing for filtering and sorting
  const processedData = useMemo(() => {
    let filterableData = [...data];

    // 1. Filtering
    if (search) {
      filterableData = filterableData.filter((item) => {
        // Search across all string fields (adjust fields as necessary)
        return (
          item.firstname.toLowerCase().includes(search.toLowerCase()) ||
          item.lastname.toLowerCase().includes(search.toLowerCase()) ||
          item.email.toLowerCase().includes(search.toLowerCase()) ||
          item.gender.toLowerCase().includes(search.toLowerCase()) ||
          item.address.toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    // 2. Sorting
    if (sort.key !== null) {
      filterableData.sort((a, b) => {
        if (a[sort.key] < b[sort.key]) {
          return sort.direction === "ascending" ? -1 : 1;
        }
        if (a[sort.key] > b[sort.key]) {
          return sort.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    // Calculate total pages for your pagination controls (you will need this)
    // const totalPages = Math.ceil(filterableData.length / itemsPerPage);

    // 3. Pagination: Slice the data based on current page and items per page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filterableData.slice(
      indexOfFirstItem,
      indexOfLastItem,
    );

    return currentItems;
  }, [data, search, sort, currentPage, itemsPerPage]);

  const totalItems = useMemo(() => {
    let filterableData = [...data];
    // Re-apply filtering and sorting logic here just to get the length
    // ... filtering and sorting logic ...
    return filterableData.length;
  }, [data, search, sort, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  // console.log("totalpage", totalPages);

  return (
    <div>
      <div className="flex justify-center items-center">
        <h2 className="p-2 text-2xl text-bold">Submitted Data</h2>
      </div>
      {data.length > 0 && (
        <div className="p-4 overflow-x-auto">
          <div className="flex h-8 m-2 ml-125">
            <input
              type="text"
              className="relative form-control w-60 border rounded-2xl p-2"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search"
            />
            <Search size={20} className="absolute ml-53 m-2 text-gray-500" />
          </div>
          <table className="min-w-full border-collapse border border-gray-300 shadow-xl">
            <thead className="bg-blue-300">
              <tr>
                <th className="border border-gray-300 p-2">Index</th>
                <th className="border border-gray-300 p-2">
                  FirstName
                  <button
                    className="bg-amber-300 ml-2"
                    onClick={() => requestSort("firstname")}
                  >
                    <ArrowDownUp size={15} />
                  </button>
                </th>
                <th className="border border-gray-300 p-2">
                  LastName
                  <button
                    className="bg-amber-300 ml-2"
                    onClick={() => requestSort("lastname")}
                  >
                    <ArrowDownUp size={15} />
                  </button>
                </th>
                <th className="border border-gray-300 p-2">
                  Email
                  <button
                    className="bg-amber-300 ml-2"
                    onClick={() => requestSort("email")}
                  >
                    <ArrowDownUp size={15} />
                  </button>
                </th>
                <th className="border border-gray-300 p-2">Gender</th>
                <th className="border border-gray-300 p-2">DOB</th>
                <th className="border border-gray-300 p-2">
                  Address
                  <button
                    className="bg-amber-300 ml-2"
                    onClick={() => requestSort("address")}
                  >
                    <ArrowDownUp size={15} />
                  </button>
                </th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {processedData.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {item.firstname}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {item.lastname}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {item.email}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {item.gender}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {item.birthday}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {item.address}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => {
                          handleEdit(item._id);
                        }}
                        //    onClick={() => {
                        //      setId(item.id);
                        //      setFormData(item);
                        //      setIsEditing(true);
                        //    }}
                        className="px-3 py-1 rounded-xl bg-blue-500 text-white hover:bg-blue-700 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 rounded-xl bg-red-500 text-white hover:bg-red-700 text-sm"
                        //    onClick={() => handleDelete(index)}
                        onClick={() => {
                          handleDelete(item._id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center items-center m-5">
            <span>
              Rows Per Page:
              <select
                name="rows"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemPerPage(Number(e.target.value));
                  handlePageChange(1); // Reset to page 1 when rows change
                }}
                className="ml-2 border rounded"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
              </select>
            </span>
            <button
              onClick={() => {
                if (currentPage !== 1) {
                  handlePageChange(currentPage - 1);
                }
              }}
              className="text-blue-500 ml-10 cursor-pointer active:scale-95 rounded px-4 py-2 font-semibold"
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => {
                if (currentPage !== totalPages) {
                  handlePageChange(currentPage + 1);
                }
              }}
              className="text-blue-500 cursor-pointer active:scale-95 rounded px-4 py-2 font-semibold"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
