import { fetchDataFx } from "@/effects/getDataFx";
import { CategoryTargetsReport } from "@/views/CategoryTargetsReport";
import { useEffect } from "react";

export default function CategoryReport () {
  useEffect(() => {
    fetchDataFx()
  }, [])
  return <CategoryTargetsReport />;
}