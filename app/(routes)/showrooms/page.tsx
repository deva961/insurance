import { DataTable } from "@/app/_components/data-table";
import { columns } from "./columns";
import { getShowrooms, ShowroomData } from "@/actions/showroom-action";

const Showrooms = async () => {
  let data: ShowroomData[] = [];

  const res = await getShowrooms();

  if (res.status === 200) {
    data = res.data;
  }

  if (res.status !== 200) {
    return (
      <div className="flex min-h-[500px] justify-center items-center text-center">
        <div>
          <h1 className="text-4xl font-semibold text-red-500">{res.status}!</h1>
          <p className="">{res.message}</p>
        </div>
      </div>
    );
  }

  return (
    <DataTable
      filterKey="name"
      filterTitle="name"
      disabled={false}
      columns={columns}
      data={data}
      createUrl="/showrooms/create"
    />
  );
};

export default Showrooms;
