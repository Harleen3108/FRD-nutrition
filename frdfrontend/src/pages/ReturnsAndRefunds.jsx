import React from "react";

const ReturnsAndRefunds = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">

      <h1 className="text-3xl font-bold mb-6">Returns & Refunds Policy</h1>

      <p className="mb-6">
        At <strong>FRD Nutrition</strong>, we prioritize product quality, hygiene,
        and customer safety. Please read our Returns & Refunds Policy carefully
        before placing an order.
      </p>

      {/* No Returns */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. No Returns Policy</h2>
        <p>
          Due to the nature of nutritional and fitness supplements,{" "}
          <strong>we do not accept returns under any circumstances</strong>.
          This policy is strictly enforced to ensure hygiene, safety, and
          authenticity of products.
        </p>
      </section>

      {/* Refunds */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Refund Policy</h2>
        <p>
          <strong>Refunds are not provided</strong> once an order is successfully
          placed and delivered.
        </p>
        <p className="mt-2">
          Please ensure all shipping details, product selection, and order
          confirmation are reviewed carefully before completing your purchase.
        </p>
      </section>

      {/* Replacement */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          3. Replacement (Damaged in Transit Only)
        </h2>
        <p>
          In very rare cases where a product is{" "}
          <strong>damaged, leaked, or tampered during transit</strong>, a
          replacement may be issued, subject to verification.
        </p>

        <ul className="list-disc ml-6 space-y-1 mt-2">
          <li>
            The issue must be reported within <strong>24 hours</strong> of
            delivery.
          </li>
          <li>
            A clear <strong>unboxing video</strong> is mandatory and must show
            the package being opened from start to finish.
          </li>
          <li>
            Clear photographs of the damaged product, outer packaging, and
            shipping label must be provided.
          </li>
        </ul>

        <p className="mt-3">
          All required details must be emailed to{" "}
          <strong>support@frdnutritionpremium.com</strong>.
        </p>

        <p className="mt-2 text-sm text-gray-600">
          Replacement requests are reviewed by the FRD Nutrition team, and the
          decision to approve or reject a request is at our sole discretion.
        </p>
      </section>

      {/* Cancellations */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Order Cancellations</h2>
        <p>
          Orders cannot be cancelled once they have been processed or
          dispatched.
        </p>
        <p className="mt-2">
          Any cancellation requests received after order confirmation will not
          be eligible for a refund.
        </p>
      </section>

      {/* Disclaimer */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Policy Disclaimer</h2>
        <p className="text-sm text-gray-600">
          FRD Nutrition reserves the right to approve or reject any replacement
          claim after verification. This policy may be updated or modified at
          any time without prior notice.
        </p>
      </section>

      {/* Contact */}
      <section>
        <h2 className="text-xl font-semibold mb-2">6. Contact Us</h2>
        <p>
          For any concerns related to this policy, please contact us at:
        </p>
        <p className="mt-2">
          <strong>Email:</strong> support@frdnutritionpremium.com
        </p>
        <p>
          <strong>Phone:</strong> +919088032004 / 01262660027
        </p>
      </section>

    </div>
  );
};

export default ReturnsAndRefunds;
