import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react';
import "./InfoBox.css";
function InfoBox({ title, cases, total, ...props}) {
    return (
        <Card  onClick={props.onClick} 
            className="infoBox">
                <CardContent>
                    <Typography className="infoBox__title" color="textSecondary">
                        {title}
                    </Typography>
                    <h2 className="infoBox__cases">{cases}</h2>
                    <Typography className="infobox__total" color="textSecondary">
                        {total} Total
                    </Typography>
                    
                </CardContent>
                
            </Card>
            
    );
}

export default InfoBox
