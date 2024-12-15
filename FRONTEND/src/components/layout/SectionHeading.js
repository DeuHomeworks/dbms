function SectionHeading({ title, subtitle, centered = false }) {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      {subtitle && (
        <h2 className="text-base font-semibold leading-7 text-primary-600">
          {subtitle}
        </h2>
      )}
      <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {title}
      </p>
    </div>
  );
}

export default SectionHeading;