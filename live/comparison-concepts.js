const positiveCategories = [
  {
    title: "Profit & pricing",
    items: [
      "Keep more profit.",
      "Reduce shipping costs by as much as 50–70%.",
      "Price products competitively in the U.S. market.",
      "Avoid the cost of hiring U.S. employees or maintaining a local office."
    ]
  },
  {
    title: "Delivery & customs",
    items: [
      "Deliver to U.S. customers nationwide in as little as five days.",
      "Clear U.S. customs and deliver products directly to customers.",
      "Coordinate with U.S. Customs when an incident or release issue occurs.",
      "Use an advanced logistics facility to route goods to the right destination."
    ]
  },
  {
    title: "Trust & customer care",
    items: [
      "Operate through a registered U.S. company to support sales.",
      "Provide live customer service through an active U.S. call center.",
      "Build buyer confidence with a registered local business.",
      "Offer a stronger return and exchange policy.",
      "Give customers domestic purchase assurance and greater peace of mind.",
      "Deliver better service to customers."
    ]
  },
  {
    title: "Sales & growth",
    items: [
      "Sell through Amazon, eBay, and other major online marketplaces.",
      "Use a U.S. sales representative to help sell your products.",
      "Work with U.S.-based staff who understand your products.",
      "Use in-house ecommerce marketing to help increase sales."
    ]
  }
];

const negativeCategories = [
  {
    title: "Cost & competition",
    items: [
      "Lower profit.",
      "Higher shipping charges when orders ship directly from overseas.",
      "Higher selling prices and fewer opportunities to compete.",
      "The cost of a U.S. office, employees, and administration raises the selling price.",
      "Outside fulfillment services add significant cost to each product."
    ]
  },
  {
    title: "Delivery & customs",
    items: [
      "International delivery can take 20 days or longer and still require customs clearance.",
      "No local representative is available to help clear or release a shipment.",
      "Products may be rejected and returned because communication is delayed or unclear."
    ]
  },
  {
    title: "Trust & customer risk",
    items: [
      "Overseas-only transactions can reduce sales because buyers lack assurance.",
      "Customers have no live U.S. support for product questions.",
      "Limited local returns and purchase protection reduce customer confidence.",
      "International return freight can cost more than the product.",
      "Unclear liability creates additional risk for the customer."
    ]
  },
  {
    title: "Sales & growth",
    items: [
      "Some overseas companies cannot participate directly in certain Amazon programs.",
      "Time-zone differences make responsive customer service difficult.",
      "No U.S. sales representative is available to support the product.",
      "General service providers may not understand or actively represent the brand.",
      "A separate marketing company is required to help increase sales."
    ]
  }
];

const conceptDetails = {
  manifest: {
    number: "Concept 01",
    name: "Cargo Manifest",
    description: "Editorial, spacious, and easy to scan. Best for a premium corporate presentation."
  },
  route: {
    number: "Concept 02",
    name: "U.S. Route Map",
    description: "A visual journey through four business stages. Best for communicating process and momentum."
  },
  deck: {
    number: "Concept 03",
    name: "Operations Deck",
    description: "Dense, structured, and highly organized. Best for decision-makers comparing operational impact."
  }
};

function renderCategories(target, categories) {
  target.innerHTML = categories.map((category, index) => `
    <article class="category">
      <div class="category-heading">
        <span class="category-number">${String(index + 1).padStart(2, "0")}</span>
        <h3>${category.title}</h3>
      </div>
      <ul>
        ${category.items.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </article>
  `).join("");
}

const positiveTarget = document.querySelector("#positive-content");
const negativeTarget = document.querySelector("#negative-content");
const conceptNumber = document.querySelector("#concept-number");
const conceptName = document.querySelector("#concept-name");
const conceptDescription = document.querySelector("#concept-description");
const buttons = [...document.querySelectorAll("[data-layout-button]")];

renderCategories(positiveTarget, positiveCategories);
renderCategories(negativeTarget, negativeCategories);

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const layout = button.dataset.layoutButton;
    const details = conceptDetails[layout];

    document.body.dataset.layout = layout;
    conceptNumber.textContent = details.number;
    conceptName.textContent = details.name;
    conceptDescription.textContent = details.description;
    buttons.forEach((item) => item.classList.toggle("is-active", item === button));
  });
});
