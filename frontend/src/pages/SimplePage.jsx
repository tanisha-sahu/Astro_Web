export default function SimplePage({ title, description }) {
  return (
    <section className="pageSection">
      <h2 className="sectionTitle">{title}</h2>
      <p className="sectionText">{description}</p>
    </section>
  )
}

