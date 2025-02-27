import TableComponent from "@/components/common/TableComponent";
import { pagingCustomer } from "@/service/customer";
import { ICustomer } from "@/types/customer";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { useEffect, useState } from "react";

import { formatCurrency } from "@/common/func";

interface User {
	_id: string;
	avatarUrl: string;
	email: string;
	full_name: string;
}
interface IData {
	_id: string;
	user: User;
	totalMoney: number;
	totalOrder: number;
	totalOrderCancel: number;
	totalOrderSuccess: number;
	totalProductSuccess: number;
	blocked_at: boolean;
	createdAt: string;
	rank: number;
}
const CustomerList = () => {
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({}); // xử lí selected
	const [, setListRowSelected] = useState<IData[]>([]);
	const [data, setData] = useState([]);
	const [searchObject, setSearchObject] = useState<ICustomer>({
		sort: -1,
		pageIndex: 1,
		pageSize: 5,
	});
	const [response, setResponse] = useState({
		pageIndex: 1,
		pageSize: 5,
		pageCount: 0,
		totalElement: 0,
		totalOptionPage: 0,
	});

	useEffect(() => {
		handleCustomer();
	}, [searchObject]);
	const handleChangePage = (value: any) => {
		setSearchObject((prev) => ({
			...prev,
			pageIndex: value.selected + 1,
		}));
		setRowSelection({});
		setListRowSelected([]);
	};
	const handleChangePageSize = (value: number) => {
		setSearchObject((prev) => ({
			...prev,
			pageSize: value,
			pageIndex: 1,
		}));
	};
	const handleCustomer = async () => {
		try {
			const { data } = await pagingCustomer(searchObject);
			setData(data.content);
			setResponse({
				pageIndex: data.pageIndex,
				pageSize: data.pageSize,
				pageCount: data.totalPage,
				totalElement: data.totalAllOptions,
				totalOptionPage: data.totalOptionPage,
			});
		} catch (error) {
			console.error("Error fetching data", error);
		}
	};
	const columns: ColumnDef<IData>[] = [
		{
			id: "full_name",
			accessorKey: "full_name",
			header: () => {
				return <div className="text-xs md:text-base">Tên</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="text-xs md:text-base">
						{row?.original?.user?.full_name}
					</div>
				);
			},
		},
		{
			id: "avatarUrl",
			accessorKey: "avatarUrl",
			header: () => {
				return <div className="text-xs md:text-base">Ảnh</div>;
			},
			cell: ({ row }) => {
				return (
					<img
						src={row.original?.user?.avatarUrl || "/avatar_25.jpg"}
						className="md:w-[40px] md:h-[40px] w-[30px] h-[30px] rounded-full"
					/>
				);
			},
		},
		{
			id: "totalOrder",
			accessorKey: "totalOrder",
			header: () => {
				return <div className="text-xs md:text-base">Số đơn hàng</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="text-xs text-center md:text-base">
						{row?.original?.totalOrder}
					</div>
				);
			},
		},
		{
			id: "totalOrderCancel",
			accessorKey: "totalOrderCancel",
			header: () => {
				return <div className="text-xs md:text-base">Số đơn hủy hàng</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="text-xs text-center md:text-base">
						{row?.original?.totalOrderCancel}
					</div>
				);
			},
		},
		{
			id: "totalOrderSuccess",
			accessorKey: "totalOrderSuccess",
			header: () => {
				return (
					<div className="text-xs md:text-base">Số đơn hàng thành công</div>
				);
			},
			cell: ({ row }) => {
				return (
					<div className="text-xs text-center md:text-base">
						{row?.original?.totalOrderSuccess}
					</div>
				);
			},
		},
		{
			id: "totalMoney",
			accessorKey: "totalMoney",
			header: () => {
				return <div className="text-xs md:text-base">Số tiền hàng</div>;
			},
			cell: ({ row }) => {
				return (
					<div className="text-xs text-center md:text-base">
						{formatCurrency(row?.original?.totalMoney)}
					</div>
				);
			},
		},
		// {
		// 	id: "rank",
		// 	accessorKey: "rank",
		// 	header: () => {
		// 		return <div className="text-xs md:text-base">Xếp hạng</div>;
		// 	},
		// 	cell: ({ row }) => {
		// 		return (
		// 			<div className="text-xs text-center md:text-base">
		// 				{row?.original?.rank}
		// 			</div>
		// 		);
		// 	},
		// },
		// {
		// 	id: "actions",
		// 	enableHiding: false,
		// 	cell: ({ row }) => {
		// 		return (
		// 			<DropdownMenu>
		// 				<DropdownMenuTrigger asChild>
		// 					<Button variant="ghost" className="w-8 h-8 p-0">
		// 						<span className="sr-only">Open menu</span>
		// 						<HiOutlineDotsVertical className="w-4 h-4" />
		// 					</Button>
		// 				</DropdownMenuTrigger>
		// 				<DropdownMenuContent align="end">
		// 					<DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
		// 					{row?.original?.blocked_at ? (
		// 						<DropdownMenuItem
		// 							className="text-green-400"
		// 							onClick={() => setopenUnbanId(row?.original?._id)}
		// 						>
		// 							Mở
		// 						</DropdownMenuItem>
		// 					) : (
		// 						<DropdownMenuItem
		// 							className="text-red-400"
		// 							onClick={() => setopenBanId(row?.original?._id)}
		// 						>
		// 							Cấm
		// 						</DropdownMenuItem>
		// 					)}
		// 				</DropdownMenuContent>
		// 			</DropdownMenu>
		// 		);
		// 	},
		// },
	];
	return (
		<div>
			<h4 className="py-4 text-base font-medium md:text-xl">
				Danh sách khách hàng
			</h4>
			<TableComponent
				data={data}
				columns={columns}
				// selected
				rowSelection={rowSelection}
				setRowSelection={setRowSelection}
				// phân trang
				handleChangePage={handleChangePage}
				pageIndex={response.pageIndex}
				pageSize={response.pageSize}
				pageCount={response.pageCount}
				totalElement={response.totalElement}
				handleChangePageSize={handleChangePageSize}
			/>
		</div>
	);
};

export default CustomerList;
