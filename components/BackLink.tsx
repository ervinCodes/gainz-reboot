'use client'

import Link from 'next/link'

interface BackLinkProps {
    href: string
    label?: string
    confirmMessage?: string
}

export default function BackLink({ href, label = 'Back', confirmMessage }: BackLinkProps) {
    return (
        <Link
            href={href}
            onClick={(e) => {
                if (confirmMessage && !window.confirm(confirmMessage)) {
                    e.preventDefault()
                }
            }}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-alloy-orange transition-colors mb-6"
        >
            <span aria-hidden="true">←</span>
            {label}
        </Link>
    )
}