import { DataTable } from "@/app/_components/data-table";
import { columns } from "./columns";
import { CategoryData, getCategories } from "@/actions/category-action";

const Category = async () => {
  let data: CategoryData[] = [];

  const categories = await getCategories();

  if (categories.status === 200) {
    data = categories.data;
  }

  if (categories.status !== 200) {
    return (
      <div className="flex min-h-[500px] justify-center items-center text-center">
        <div>
          <h1 className="text-4xl font-semibold text-red-500">
            {categories.status}!
          </h1>
          <p className="">{categories.message}</p>
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
      createUrl="/category/create"
    />
  );
};

export default Category;
