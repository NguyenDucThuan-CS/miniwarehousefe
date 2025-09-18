import { Metadata } from "next";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateAvatarFallback(string: string) {
  const names = string.split(" ").filter((name: string) => name);
  const mapped = names.map((name: string) => name.charAt(0).toUpperCase());

  return mapped.join("");
}

export function generateMeta({
  title,
  description,
  canonical
}: {
  title: string;
  description: string;
  canonical: string;
}): Metadata {
  return {
    title: `${title} - Shadcn UI Kit`,
    description: description,
    metadataBase: new URL(`https://shadcnuikit.com`),
    alternates: {
      canonical: `/dashboard${canonical}`
    },
    openGraph: {
      images: [`https://bundui-images.netlify.app/seo.jpg`]
    }
  };
}

// a function to get the first letter of the first and last name of names
export const getInitials = (fullName: string) => {
  const nameParts = fullName.split(" ");
  const firstNameInitial = nameParts[0].charAt(0).toUpperCase();
  const lastNameInitial = nameParts[1].charAt(0).toUpperCase();
  return `${firstNameInitial}${lastNameInitial}`;
};



export const handleExportExcel = (headers: any, data: any, fileName: string) => {
    const csvContent = [headers.join(','), ...data.map((row: any) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const formateDate = (date: string | undefined) => {
    if (!date) return '';
    return format(new Date(date), "dd MMM yyyy");
}


export const formatNumber = (number: number, decimalPlaces: number = 0) => {
    return number.toLocaleString('en-US', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces
    });
}

export const handleFileDownload = (pathFileName: string, fileName: string) => {
    if (!pathFileName) return;
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = pathFileName;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

