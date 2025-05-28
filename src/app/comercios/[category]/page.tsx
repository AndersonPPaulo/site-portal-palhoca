"use client";
import { useParams } from "next/navigation";
import Comercio from "../page"; 

export default function ComercioCategory() {
  const params = useParams();
  return <Comercio />;
}