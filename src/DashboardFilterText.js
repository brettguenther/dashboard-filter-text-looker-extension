// Copyright 2021 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, { useEffect, useState, useContext } from 'react'
import { Box, ComponentsProvider, Span } from '@looker/components'
import { ExtensionContext40 } from '@looker/extension-sdk-react'

export const DashboardFilterText = () => {

  const { tileHostData } = useContext(ExtensionContext40);
  const [myFilterValue, setMyFilterValue] = useState("all values");

  useEffect(() => {
    const currentFilterValue = tileHostData?.dashboardFilters?.['MyFilter'];
    setMyFilterValue(currentFilterValue);
  }, [tileHostData]); // Re-run this effect whenever tileHostData changes

  return (
    <ComponentsProvider>
      {myFilterValue && (
        <Box bg="olive" p="u4" m="u4" borderRadius="4px">
          <Span color="white" fontSize="large" fontWeight="bold">
            Planning for MyFilter Value: {myFilterValue}
          </Span>
        </Box>
      )}
    </ComponentsProvider>
  )
}
