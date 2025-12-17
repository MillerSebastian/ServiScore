import type { Metadata } from "next"

export const siteConfig = {
  name: "ServiScore",
  description: "Community Marketplace & Store Ratings - Connect with local services and businesses",
  url: "https://serviscore.com",
  ogImage: "https://serviscore.com/og-image.png",
  links: {
    twitter: "https://twitter.com/serviscore",
    github: "https://github.com/serviscore",
  },
}

export function createMetadata({
  title,
  description,
  image,
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  noIndex?: boolean
}): Metadata {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name
  const metaDescription = description || siteConfig.description
  const metaImage = image || siteConfig.ogImage

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: [
      "community marketplace",
      "local services",
      "store ratings",
      "service providers",
      "local businesses",
      "community platform",
    ],
    authors: [{ name: "ServiScore Team" }],
    creator: "ServiScore",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      title: metaTitle,
      description: metaDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
      creator: "@serviscore",
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
    ...(noIndex && {
      metadataBase: new URL(siteConfig.url),
    }),
  }
}
