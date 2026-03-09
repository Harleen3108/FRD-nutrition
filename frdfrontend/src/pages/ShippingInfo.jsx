import React from "react";

const ShippingInfo = () => {
  return (
    <div id="shipping-info" className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      
      <h1 className="text-3xl font-bold mb-6">Shipping Information</h1>

      <p className="mb-6">
        At <strong>FRD Nutrition</strong>, we ensure your fitness supplements are
        packed securely and delivered as quickly as possible.
      </p>

      {/* Delivery Locations */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Delivery Locations</h2>
        <p>
          We deliver <strong>across all locations in India</strong> to serviceable
          pincodes using trusted courier partners.
        </p>
      </section>

      {/* Processing Time */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Order Processing Time</h2>
        <p>
          Orders are usually processed and dispatched within{" "}
          <strong>24–48 working hours</strong> after successful payment.
          Orders placed on Sundays or public holidays are processed on the next
          working day.
        </p>
      </section>

      {/* Delivery Time */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Estimated Delivery Time</h2>
        <p>
          Once dispatched, orders are typically delivered within{" "}
          <strong>4–8 business days</strong>.
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Delivery timelines may occasionally vary due to remote locations,
          regional restrictions, courier delays, or unforeseen circumstances.
        </p>
      </section>

      {/* Shipping Charges */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Shipping Charges</h2>
        <p>
          <strong>Flat shipping fee:</strong> ₹50 per order across India.
        </p>
      </section>

      {/* COD */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Cash on Delivery (COD)</h2>
        <p>
          Cash on Delivery is <strong>not available</strong>. All orders must be
          prepaid through online payment methods.
        </p>
      </section>

      {/* Tracking */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Order Tracking</h2>
        <p>
          After dispatch, tracking details will be available in the{" "}
          <strong>“My Orders”</strong> section of your account.
        </p>
      </section>

      {/* Damage Policy */}
<section className="mb-6">
  <h2 className="text-xl font-semibold mb-2">
    7. Damaged or Tampered Package
  </h2>
  <ul className="list-disc ml-6 space-y-1">
    <li>
      Any issues relating to damaged, leaked, or tampered packages must be
      reported within <strong>24 hours</strong> of delivery.
    </li>
    <li>
      A clear <strong>unboxing video</strong> recorded from the moment the seal
      is opened is <strong>mandatory</strong>.
    </li>
    <li>
      Clear photos of the outer packaging, inner product, and shipping label
      must be shared.
    </li>
  </ul>
  <p className="mt-2">
    All required details must be emailed to{" "}
    <strong>support@frdnutritionpremium.com</strong>.
  </p>
  <p className="mt-2 text-sm text-gray-600">
    Please note: All claims are subject to verification by the FRD Nutrition
    team. FRD Nutrition reserves the right to approve or reject any claim based
    on the provided evidence.
  </p>
</section>

{/* Returns */}
<section className="mb-6">
  <h2 className="text-xl font-semibold mb-2">8. Returns & Replacement</h2>
  <p>
    Due to the nature of nutritional and health supplements,{" "}
    <strong>returns are not accepted under any circumstances</strong>.
  </p>
  <p className="mt-2">
    In rare cases of verified transit damage, a{" "}
    <strong>replacement may be issued at our sole discretion</strong>.
    No refunds or returns will be provided in any case.
  </p>
</section>


      {/* Support */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">9. Contact & Support</h2>
        <p>
          <strong>Email:</strong> support@frdnutritionpremium.com
        </p>
        <p>
          <strong>Phone:</strong> 094668 32004
        </p>
        <p className="mt-2 text-sm text-gray-600">
          <strong>Address:</strong><br />
          FRD Nutrition<br />
          Chhar Khamba Road, near Tikona Park,<br />
          near Aarya Samaj Mandir,<br />
          Model Town, Rohtak, Haryana – 124001
        </p>
      </section>

    </div>
  );
};

export default ShippingInfo;
