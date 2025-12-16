export default function ProposalDisplay({ proposal }) {
  const { executiveSummary, technicalRationale, pricingStrategy, clientInfo } = proposal;

  return (
    <div className="space-y-8">
      {/* Version Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold text-sm">
            Version {proposal.version}
          </span>
          {proposal.version > 1 && (
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold text-sm">
              Revised
            </span>
          )}
        </div>
        <div className="text-sm text-gray-600">
          Confidence Score: <span className="font-bold text-blue-600">{executiveSummary.confidenceScore}%</span>
        </div>
      </div>

      {/* Change Log (if revised) */}
      {proposal.version > 1 && proposal.changeLog && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Changes Made
          </h3>
          <p className="text-sm text-yellow-800">{proposal.changeLog}</p>
        </div>
      )}

      {/* Client Information */}
      {clientInfo && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Client Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-600">Client</p>
              <p className="text-lg text-gray-900">{clientInfo.client}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Due Date</p>
              <p className="text-lg text-gray-900">{clientInfo.dueDate}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Project Value</p>
              <p className="text-lg text-gray-900">{clientInfo.projectValue}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Key Requirements</p>
              <p className="text-sm text-gray-700">{clientInfo.keyRequirements}</p>
            </div>
          </div>
        </div>
      )}

      {/* Executive Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Executive Summary
        </h3>
        
        <div className="mb-4">
          <span className={`inline-block px-4 py-2 rounded-full font-bold text-sm ${
            executiveSummary.position === 'GO' 
              ? 'bg-green-100 text-green-800' 
              : executiveSummary.position === 'NO-GO'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {executiveSummary.position}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Recommendation</h4>
            <p className="text-gray-700">{executiveSummary.recommendation}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Strategic Rationale</h4>
            <p className="text-gray-700">{executiveSummary.rationale}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Key Strengths</h4>
            <ul className="list-disc list-inside space-y-1">
              {executiveSummary.strengths?.map((strength, idx) => (
                <li key={idx} className="text-gray-700">{strength}</li>
              ))}
            </ul>
          </div>

          {executiveSummary.risks && executiveSummary.risks.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Identified Risks</h4>
              <ul className="list-disc list-inside space-y-1">
                {executiveSummary.risks.map((risk, idx) => (
                  <li key={idx} className="text-red-700">{risk}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Next Steps</h4>
            <ol className="list-decimal list-inside space-y-1">
              {executiveSummary.nextSteps?.map((step, idx) => (
                <li key={idx} className="text-gray-700">{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Technical Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Technical Analysis
        </h3>

        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-600">Overall Spec Match</span>
            <span className="text-2xl font-bold text-green-600">{technicalRationale.specMatch}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
            <div 
              className="bg-green-600 h-3 rounded-full transition-all"
              style={{ width: `${technicalRationale.specMatch}%` }}
            ></div>
          </div>
        </div>

        <p className="text-gray-700 mb-6">{technicalRationale.summary}</p>

        {/* Product Matches */}
        <div className="space-y-4">
          {technicalRationale.details?.map((detail, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  {/* Handle both old (requirement) and new (category) data structures */}
                  <h4 className="font-semibold text-gray-900">{detail.category || detail.requirement}</h4>
                  {detail.items && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Includes:</span> {detail.items}
                    </p>
                  )}
                  {detail.recommendedSKU && (
                    <p className="text-sm text-blue-600 font-mono">{detail.recommendedSKU}</p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  detail.matchPercentage >= 90 
                    ? 'bg-green-100 text-green-800'
                    : detail.matchPercentage >= 75
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {detail.matchPercentage}% Match
                </span>
              </div>
              
              <p className="text-sm text-gray-700 mb-2">{detail.capabilities || detail.justification}</p>
              
              {detail.standards && (
                <div className="mt-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Standards:</span>
                  <span className="ml-2 text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">{detail.standards}</span>
                </div>
              )}
              
              {detail.specifications && (
                <div className="bg-gray-50 rounded p-3 mt-2">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Specifications</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(detail.specifications).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-gray-600">{key}:</span>{' '}
                        <span className="text-gray-900 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detail.alternativeSKUs && detail.alternativeSKUs.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  Alternatives: {detail.alternativeSKUs.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Technical Risks */}
        {technicalRationale.risks && technicalRationale.risks.length > 0 && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-900 mb-3">Technical Risks</h4>
            <div className="space-y-3">
              {technicalRationale.risks.map((risk, idx) => (
                <div key={idx}>
                  <p className="text-sm font-semibold text-red-800">{risk.item}</p>
                  <p className="text-sm text-red-700">Issue: {risk.issue}</p>
                  <p className="text-sm text-gray-700">Mitigation: {risk.mitigation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pricing Strategy */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Pricing Strategy
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-semibold mb-1">Base Cost</p>
            <p className="text-3xl font-bold text-blue-900">
              ${pricingStrategy.baseCost?.toLocaleString() || 'N/A'}
            </p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-600 font-semibold mb-1">Recommended Bid</p>
            <p className="text-3xl font-bold text-green-900">
              ${pricingStrategy.recommendedBid?.toLocaleString() || 'N/A'}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">Justification</h4>
          <p className="text-gray-700">{pricingStrategy.justification}</p>
        </div>

        {/* Price Breakdown */}
        {pricingStrategy.breakdown && pricingStrategy.breakdown.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Cost Breakdown</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="text-left py-2 px-3">Item</th>
                    <th className="text-center py-2 px-3">Quantity</th>
                    <th className="text-right py-2 px-3">Unit Price</th>
                    <th className="text-right py-2 px-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingStrategy.breakdown.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-2 px-3">{item.item}</td>
                      <td className="text-center py-2 px-3">{item.quantity}</td>
                      <td className="text-right py-2 px-3">${item.unitPrice?.toLocaleString()}</td>
                      <td className="text-right py-2 px-3 font-semibold">${item.total?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Complimentary Services */}
        {pricingStrategy.complimentaryServices && pricingStrategy.complimentaryServices.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-green-900 mb-2">Complimentary Services</h4>
            <ul className="list-disc list-inside space-y-1">
              {pricingStrategy.complimentaryServices.map((service, idx) => (
                <li key={idx} className="text-sm text-green-800">{service}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Additional Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {pricingStrategy.paymentTerms && (
            <div>
              <p className="font-semibold text-gray-600">Payment Terms</p>
              <p className="text-gray-900">{pricingStrategy.paymentTerms}</p>
            </div>
          )}
          {pricingStrategy.validityPeriod && (
            <div>
              <p className="font-semibold text-gray-600">Validity Period</p>
              <p className="text-gray-900">{pricingStrategy.validityPeriod}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
