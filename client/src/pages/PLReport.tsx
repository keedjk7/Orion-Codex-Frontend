import { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Type definition for PL Account item
interface PLAccountItem {
  plCode: string;
  plAccount: string;
  reportIndex: string;
  weight: string;
  recurring: string;
  level8?: string;
  level7?: string;
  level6?: string;
  level5?: string;
  level4?: string;
  level3?: string;
  level2?: string;
  level1?: string;
  status: string;
}

// Hierarchical node structure
interface PLNode {
  item: PLAccountItem;
  children: PLNode[];
  level: number;
  isExpanded: boolean;
}

const PLReport = () => {
  // Parse the CSV data
  const rawData = `PL Code,PLAccount,Report Index,PL Code,Weight,Recurring,Level8,Level7,Level6,Level5,Level4,Level3,Level2,Level1
Inactive,1001 (Cost)-SAP License (Cost),,,1,,NPAT,EBT,EBIT,Gross Profit,6G Cost,LOB Enterprise Service (Cost),SAP Licensing (Cost),
Inactive,1001 (Income)-SAP License (Income),,,1,Y,NPAT,EBT,EBIT,Gross Profit,6G Income,LOB Enterprise Service (Income),SAP Licensing (Income),
0001,NPAT,380,0001,1,,,,,,,,,
0002,Taxes,379,0002,-1,,NPAT,,,,,,,
Inactive,899360A,,,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,EPO Unallocated Exp.,Network team,,
Inactive,899360B,,,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,EPO Unallocated Exp.,Network team,,
Inactive,AMATA Operation,,,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,Infra Unallocated Exp.,,,
0003,EBT,378,0003,1,,NPAT,,,,,,,
0004,Interest Exp.,377,0004,-1,,NPAT,EBT,,,,,,
0005,EBIT,376,0005,1,,NPAT,EBT,,,,,,
Inactive,AMS (Internal+Presales),,,1,,NPAT,EBT,EBIT,Total Selling and Administrative,,,,
0006,Total Selling and Administrative,375,0006,-1,,NPAT,EBT,EBIT,,,,,
0007,Standardize Assurance,374,0007,1,,NPAT,EBT,EBIT,Total Selling and Administrative,,,,
0008,Others Exp. - SG&A,373,0008,1,,NPAT,EBT,EBIT,Total Selling and Administrative,,,,
0009,Finance & Corporate Services,372,0009,1,,NPAT,EBT,EBIT,Total Selling and Administrative,,,,
0010,MD office,371,0010,1,,NPAT,EBT,EBIT,Total Selling and Administrative,,,,
0011,Marketing,370,0011,1,,NPAT,EBT,EBIT,Total Selling and Administrative,,,,
0012,Presales Smart,369,0012,1,,NPAT,EBT,EBIT,Total Selling and Administrative,,,,
0013,Presales EPS-Cloud,368,0013,1,,NPAT,EBT,EBIT,Total Selling and Administrative,,,,
Inactive,Argento team,,,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,,,,
0014,Commercial-Presales&PM,367,0014,1,,NPAT,EBT,EBIT,Total Selling and Administrative,,,,
Inactive,BC (Business Consulting) (Cost),,,1,,NPAT,EBT,EBIT,Gross Profit,6G Cost,LOB Solution Development (Cost),Business Planing (Cost),
Inactive,BC (Business Consulting) (Income),,,1,Y,NPAT,EBT,EBIT,Gross Profit,6G Income,LOB Solution Development (Income),Business Planing (Income),
0015,IT Services,366,0015,1,,NPAT,EBT,EBIT,Total Selling and Administrative,,,,
0016,EP-Commercial   (Internal),365,0016,1,,NPAT,EBT,EBIT,Total Selling and Administrative,,,,
0017,Infra-Commerical - Commission,364,0017,1,,NPAT,EBT,EBIT,Total Selling and Administrative,,,,
0018,Sell and Promotion,363,0018,1,,NPAT,EBT,EBIT,Total Selling and Administrative,,,,
0019,Total Unallocated Exp.,362,0019,-1,,NPAT,EBT,EBIT,,,,,
0020,Client Unallocated Exp.,361,0020,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,,,,
Inactive,BI (Data Analytic) (Income),,,1,Y,NPAT,EBT,EBIT,Gross Profit,6G Income,LOB Solution Development (Income),Business intelligence (Income),
Inactive,BK NIX (Cost),,,1,,NPAT,EBT,EBIT,Gross Profit,6G Cost,LOB Enterprise Operation (Cost),Managed Workplace-Infra (Cost),
Inactive,BK NIX (Income),,,1,Y,NPAT,EBT,EBIT,Gross Profit,6G Income,LOB Enterprise Operation (Income),Managed Workplace-Infra (Income),
0021,Customer Care & Service Desk,360,0021,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,Client Unallocated Exp.,,,
0022,Business Solution - Outsources Trading & Rental,359,0022,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,Client Unallocated Exp.,,,
0023,Business Solution - Outsources services,358,0023,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,Client Unallocated Exp.,,,
0024,Smart Unallocated Exp.,357,0024,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,,,,
0025,Command Center,356,0025,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,Smart Unallocated Exp.,,,
0026,Smart Solution,355,0026,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,Smart Unallocated Exp.,,,
0027,EP-GIS,354,0027,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,Smart Unallocated Exp.,,,
Inactive,BOI-BNDC5 (A),,,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,Infra Unallocated Exp.,,,
Inactive,BOI-BNDC5 (B),,,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,Infra Unallocated Exp.,,,
0028,SoDev Unallocated Exp.,353,0028,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,,,,
0029,PS,352,0029,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,SoDev Unallocated Exp.,,,
0030,Security Solution,351,0030,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,SoDev Unallocated Exp.,,,
0031,Solution Development 3,350,0031,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,SoDev Unallocated Exp.,,,
0032,Solution Development 2,349,0032,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,SoDev Unallocated Exp.,,,
0033,Solution Development,348,0033,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,SoDev Unallocated Exp.,,,
0034,EPO Unallocated Exp.,347,0034,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,,,,
0035,ICT Operation,346,0035,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,EPO Unallocated Exp.,,,
0036,Network team,345,0036,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,EPO Unallocated Exp.,,,
0037,EP-Solution&Services + Network,344,0037,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,EPO Unallocated Exp.,Network team,,
0038,Interenational Gateway,343,0038,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,EPO Unallocated Exp.,,,
0039,EPS Unallocated Exp.,342,0039,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,,,,
0040,AMS,341,0040,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,EPS Unallocated Exp.,,,
0041,Cloud,340,0041,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,EPS Unallocated Exp.,,,
0042,VPS,339,0042,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,EPS Unallocated Exp.,,,
0043,PR Cloud-Technical,338,0043,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,EPS Unallocated Exp.,,,
0044,PR Cloud-Support,337,0044,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,EPS Unallocated Exp.,,,
0045,SAP,336,0045,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,EPS Unallocated Exp.,,,
0046,Infra Unallocated Exp.,335,0046,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,,,,
0047,Krones Showroom,334,0047,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,Infra Unallocated Exp.,,,
0048,BN4 Operation,333,0048,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,Infra Unallocated Exp.,,,
0049,BN32 Operation,332,0049,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,Infra Unallocated Exp.,,,
0050,Bangna Operation Fl6,331,0050,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,Infra Unallocated Exp.,,,
0051,BNDC 5 Operation,330,0051,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,Infra Unallocated Exp.,,,
0052,BNDC2 Operation,329,0052,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,Infra Unallocated Exp.,,,
0053,BNDC3 Operation,328,0053,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,Infra Unallocated Exp.,,,
0054,ETDC Operation,327,0054,1,,NPAT,EBT,EBIT,Total Unallocated Exp.,Infra Unallocated Exp.,,,
0055,Gross Profit,326,0055,1,,NPAT,EBT,EBIT,,,,,
0056,6G Cost,325,0056,-1,,NPAT,EBT,EBIT,Gross Profit,,,,
0215,6G Income,166,0215,1,,NPAT,EBT,EBIT,Gross Profit,,,,`;

  const parsedData = useMemo(() => {
    const lines = rawData.split('\n').filter(line => line.trim());
    const items: PLAccountItem[] = [];
    
    // Skip header
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',');
      if (parts.length >= 14) {
        items.push({
          status: parts[0],
          plAccount: parts[1],
          reportIndex: parts[2],
          plCode: parts[3],
          weight: parts[4],
          recurring: parts[5],
          level8: parts[6],
          level7: parts[7],
          level6: parts[8],
          level5: parts[9],
          level4: parts[10],
          level3: parts[11],
          level2: parts[12],
          level1: parts[13],
        });
      }
    }
    
    // Filter out inactive items
    return items.filter(item => item.status !== 'Inactive');
  }, []);

  // Build hierarchical structure
  const buildHierarchy = (items: PLAccountItem[]): PLNode[] => {
    const rootNodes: PLNode[] = [];
    const nodeMap = new Map<string, PLNode>();

    // First pass: create all nodes
    items.forEach(item => {
      const node: PLNode = {
        item,
        children: [],
        level: 0,
        isExpanded: true,
      };
      nodeMap.set(item.plAccount, node);
    });

    // Second pass: build hierarchy
    items.forEach(item => {
      const node = nodeMap.get(item.plAccount);
      if (!node) return;

      // Determine the hierarchy path
      const levels = [
        item.level8,
        item.level7,
        item.level6,
        item.level5,
        item.level4,
        item.level3,
        item.level2,
        item.level1,
      ].filter(l => l && l.trim());

      // Calculate depth
      node.level = levels.length;

      // If no parent levels, it's a root node
      if (levels.length === 0) {
        rootNodes.push(node);
      } else {
        // Find the immediate parent
        const parentName = levels[levels.length - 1];
        const parentNode = nodeMap.get(parentName);
        
        if (parentNode) {
          parentNode.children.push(node);
        } else {
          // If parent not found, add to root
          rootNodes.push(node);
        }
      }
    });

    return rootNodes;
  };

  const [expandedState, setExpandedState] = useState<Record<string, boolean>>({});
  const [expandAll, setExpandAll] = useState(true);

  const toggleExpand = (plAccount: string) => {
    setExpandedState(prev => ({
      ...prev,
      [plAccount]: !prev[plAccount],
    }));
  };

  const toggleExpandAll = () => {
    const newState = !expandAll;
    setExpandAll(newState);
    
    // Clear individual states when using expand all
    if (newState) {
      setExpandedState({});
    }
  };

  const isExpanded = (plAccount: string): boolean => {
    if (plAccount in expandedState) {
      return expandedState[plAccount];
    }
    return expandAll;
  };

  const hierarchicalData = useMemo(() => buildHierarchy(parsedData), [parsedData]);

  // Render a single row with proper indentation
  const renderRow = (node: PLNode, depth: number = 0): JSX.Element[] => {
    const hasChildren = node.children.length > 0;
    const expanded = isExpanded(node.item.plAccount);
    const rows: JSX.Element[] = [];

    rows.push(
      <tr
        key={node.item.plAccount}
        className="border-b hover:bg-gray-50 transition-colors"
      >
        <td className="py-3 px-4" style={{ paddingLeft: `${depth * 24 + 16}px` }}>
          <div className="flex items-center gap-2">
            {hasChildren ? (
              <button
                onClick={() => toggleExpand(node.item.plAccount)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                {expanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                )}
              </button>
            ) : (
              <div className="w-6" />
            )}
            <span className="font-medium text-gray-900">{node.item.plAccount}</span>
          </div>
        </td>
        <td className="py-3 px-4 text-center text-gray-700">{node.item.plCode}</td>
        <td className="py-3 px-4 text-center text-gray-700">{node.item.reportIndex}</td>
        <td className="py-3 px-4 text-center">
          <span
            className={`inline-block px-2 py-1 rounded text-sm ${
              node.item.weight === '1'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {node.item.weight}
          </span>
        </td>
        <td className="py-3 px-4 text-center">
          {node.item.recurring === 'Y' && (
            <span className="inline-block px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
              Recurring
            </span>
          )}
        </td>
      </tr>
    );

    // Render children if expanded
    if (expanded && hasChildren) {
      node.children.forEach(child => {
        rows.push(...renderRow(child, depth + 1));
      });
    }

    return rows;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Profit & Loss Statement</CardTitle>
              <CardDescription className="mt-2">
                Hierarchical view of P&L accounts with expandable structure
              </CardDescription>
            </div>
            <Button
              onClick={toggleExpandAll}
              variant="outline"
              className="flex items-center gap-2"
            >
              {expandAll ? (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Collapse All
                </>
              ) : (
                <>
                  <ChevronRight className="w-4 h-4" />
                  Expand All
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700 border-b-2">
                    Account Name
                  </th>
                  <th className="py-3 px-4 text-center font-semibold text-gray-700 border-b-2">
                    PL Code
                  </th>
                  <th className="py-3 px-4 text-center font-semibold text-gray-700 border-b-2">
                    Report Index
                  </th>
                  <th className="py-3 px-4 text-center font-semibold text-gray-700 border-b-2">
                    Weight
                  </th>
                  <th className="py-3 px-4 text-center font-semibold text-gray-700 border-b-2">
                    Recurring
                  </th>
                </tr>
              </thead>
              <tbody>
                {hierarchicalData.map(node => renderRow(node))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Legend:</h4>
            <div className="space-y-1 text-sm text-blue-800">
              <p><strong>Weight:</strong> 1 (positive/income) or -1 (negative/expense)</p>
              <p><strong>Recurring:</strong> Y indicates recurring revenue/expense</p>
              <p><strong>Hierarchy:</strong> Click the arrow icons to expand/collapse account groups</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PLReport;

